import { load } from 'js-yaml'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { OpenAPIV3 } from 'openapi-types'
import merge from 'deepmerge'
import { logger } from './logger'

function isOpenAPIDocument(obj: any): obj is OpenAPIV3.Document {
  if (!obj) return false
  if (typeof obj !== 'object') return false
  if (!('openapi' in obj)) return false
  if (!('info' in obj)) return false
  if (!('paths' in obj)) return false
  return true
}

export function loadConfigYaml() {
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
