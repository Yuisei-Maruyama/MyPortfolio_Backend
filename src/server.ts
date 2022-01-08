import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import { exit } from '.'
import { connectDB, eventListen } from './database'
import docUi from 'swagger-ui-express'
import { join } from 'path'
import terminalLink from 'terminal-link'
import { logger } from './logger'
import { loadConfigYaml } from './apiDoc'
import { initializeYaml } from './initialize'

export const app = express()

app.use(cors())

const server = createServer(app)

connectDB()
eventListen()

const PORTFOLIO_PORT = process.env.PORTFOLIO_PORT || exit('PORTFOLIO_PORT not found.', 1)
const PORTFOLIO_APIDOC_CLIENT = process.env.PORTFOLIO_APIDOC_CLIENT || exit('PORTFOLIO_APIDOC_CLIENT not found', 1)
const PORTFOLIO_APIDOC_REDIRECT_URL = process.env.PORTFOLIO_APIDOC_REDIRECT_URL || exit('PORTFOLIO_APIDOC_REDIRECT_URL not found', 1)

const apiConfig = loadConfigYaml()
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

logger.debug('apiDoc:', apiDoc)

initializeYaml()

app.use(`/v${major}/api-docs`, docUi.serve, docUi.setup(undefined, docUiOptions))


server.listen(PORTFOLIO_PORT, () => {
  logger.info('server started.', { port: PORTFOLIO_PORT })
  logger.http(terminalLink('SwaggerDocsURL:', `localhost:${PORTFOLIO_PORT}/v${major}/api-docs`))
})
