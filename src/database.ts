import mongoose from 'mongoose'
import { exit } from '.'
import { logger } from './server'

export const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.PORTFOLIO_DB_URL) return
    await mongoose.connect(process.env.PORTFOLIO_DB_URL)
  } catch {
    exit('PORTFOLIO_DB_URL not found.', 1)
  }
}

export const eventListen = async (): Promise<void> => {
  await mongoose.connection.once('open', () => {
    logger.info('db.connected')
  })
}
