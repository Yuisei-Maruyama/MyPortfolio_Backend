import express from 'express'
import { getSteps } from './steps'

export const router = express.Router()

getSteps()
