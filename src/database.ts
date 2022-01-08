import mongoose from 'mongoose'
import express from 'express'
import { exit } from '.'
import { app } from './server'
import { logger } from './logger'
import { router } from './routers'

const routes = router

export const connectDB = async (): Promise<void> => {
  try {
    // console.log(process.env.PORTFOLIO_DB_URL)
    if (!process.env.PORTFOLIO_DB_URL) return
    await mongoose.connect(process.env.PORTFOLIO_DB_URL)
    app.use(express.json())
    app.use("/", routes)
  } catch {
    exit('PORTFOLIO_DB_URL not found.', 1)
  }
}

export const eventListen = async (): Promise<void> => {
  await mongoose.connection.once('open', () => {
    logger.info('db.connected')
  })
}
