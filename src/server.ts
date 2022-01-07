import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import { exit } from '.'
import { connectDB, eventListen } from './database'
import { OpenAPIV3 } from 'openapi-types'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { load } from 'js-yaml'
import merge from 'deepmerge'
import winston, { loggers, format, transports } from 'winston'
import docUi from 'swagger-ui-express'
import { initialize } from 'express-openapi'
import { join } from 'path'
import terminalLink from 'terminal-link'

export const app = express()

app.use(cors())

const server = createServer(app)

connectDB()
eventListen()

const PORTFOLIO_NAME = process.env.PORTFOLIO_NAME || exit('PORTFOLIO_NAME not found.', 1)
const PORTFOLIO_PORT = process.env.PORTFOLIO_PORT || exit('PORTFOLIO_PORT not found.', 1)
const PORTFOLIO_APIDOC_CLIENT = process.env.PORTFOLIO_APIDOC_CLIENT || exit('PORTFOLIO_APIDOC_CLIENT not found', 1)
const PORTFOLIO_APIDOC_REDIRECT_URL = process.env.PORTFOLIO_APIDOC_REDIRECT_URL || exit('PORTFOLIO_APIDOC_REDIRECT_URL not found', 1)

class Logger {
  nameStack: string[] = []
  logger: winston.Logger

  constructor() {
    this.logger = loggers.add(PORTFOLIO_NAME, {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly', // 記録するログレベルの設定
      format: format.combine(format.timestamp(), format.label({ label: PORTFOLIO_NAME })),
      transports: [
        new winston.transports.Console({ // コンソールへ出力する
          format: format.combine(
            format.colorize({ all: true }),
            format.printf(
              ({ level, timestamp, label, message, category, ...rest }) =>
                `${timestamp} ${level} [${label}] ${category || ''}: ${message.trimEnd()} ${JSON.stringify(rest)}`
            )
          )
        })
      ]
    })
  }
}
export const logger = new Logger().logger

function isOpenAPIDocument(obj: any): obj is OpenAPIV3.Document {
  if (!obj) return false
  if (typeof obj !== 'object') return false
  if (!('openapi' in obj)) return false
  if (!('info' in obj)) return false
  if (!('paths' in obj)) return false
  return true
}

function loadConfig() {
  const docs = []
  try {
    const loaded = load(readFileSync(resolve(__dirname, '../openapi.yaml')).toString())
    if (!isOpenAPIDocument(loaded)) throw Error('既定の openapi.yaml が不正です。')
    docs.push(loaded)
  } catch (err) {
    logger.error('既定の openapi.yaml が読み込めません。', err)
  }

  try {
    const loaded = load(readFileSync(resolve(process.cwd(), 'openapi.yaml')).toString())
    if (!isOpenAPIDocument(loaded)) throw Error('openapi.yaml が不正です。')
    docs.push(loaded)
  } catch (err) {
    logger.warn('追加の openapi.yaml が読み込めません。', err)
  }

  const apiDoc = merge.all(docs, { arrayMerge: (_, source) => source })
  logger.info('openapi.yaml をマージしました。')
  if (!isOpenAPIDocument(apiDoc)) throw Error('openapi.yaml が不正です。')
  return apiDoc
}

const apiConfig = loadConfig()
const { version } = require(join(process.cwd(), 'package.json'))
const [major] = version.split('.')
const apiDoc = { ...apiConfig, servers: [{ url: `/v${major}` }], info: { ...apiConfig.info, version }}

// API Document
const docUiOptions = {
  swaggerUrl: `/v${major}/schema`,
  swaggerOptions: {
    oauth: { clientId: PORTFOLIO_APIDOC_CLIENT },
    oauth2RedirectUrl: PORTFOLIO_APIDOC_REDIRECT_URL
  }
}

// REST
// express-openapiの初期化
logger.debug('apiDoc:', apiDoc)
initialize({
  app,
  apiDoc,
  errorMiddleware: (err, req, res, next) => { // express-openapiが標準でやってくれるバリデーション結果のレスポンス処理
    res.status(err.status || 500).send(err.status ? err : err.toString())
    next()
  },
  docsPath: '/schema',
  exposeApiDocs: true, // exposeApiDocsをtrueにすることでGET /schemaで完全版のスキーマが取得できる
  promiseMode: true,
  operations: {
    findHobbies: function (req, res) {
      res.send('hobby')
    }
  },
  consumesMiddleware: { 'application/json': express.json() } // Content-Typeの指定
  // securityHandlers: { oauth2 }
})

app.use(`/v${major}/api-docs`, docUi.serve, docUi.setup(undefined, docUiOptions))


server.listen(PORTFOLIO_PORT, () => {
  logger.info('server started.', { port: PORTFOLIO_PORT })
  logger.http(terminalLink('SwaggerDocsURL:', `localhost:${PORTFOLIO_PORT}/v${major}/api-docs`))
})
