import express from 'express'
import { join } from 'path'
import { initialize } from 'express-openapi'
import { app } from './server'
import { loadConfigYaml } from './apiDoc'
import { fetchSteps, getStep, createStep, updateStep, deleteStep } from './routers/steps'

const apiConfig = loadConfigYaml()
const { version } = require(join(process.cwd(), 'package.json'))
const [major] = version.split('.')
const apiDoc = { ...apiConfig, servers: [{ url: `/v${major}` }], info: { ...apiConfig.info, version }}

// REST
// express-openapiの初期化
// APIドキュメントからexpressに処理を追加
export const initializeYaml = () => initialize({
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
    },
    fetchSteps: fetchSteps,
    getStep: getStep,
    createStep: createStep,
    updateStep: updateStep,
    deleteStep: deleteStep
  },
  consumesMiddleware: { 'application/json': express.json() } // Content-Typeの指定
  // securityHandlers: { oauth2 }
})
