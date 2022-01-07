import express from 'express'
import { fetchSteps, createStep } from './steps'

export const router = express.Router()

fetchSteps()
createStep()
