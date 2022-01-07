import express from 'express'
import { fetchSteps, getStep, createStep } from './steps'

export const router = express.Router()

fetchSteps()
getStep()
createStep()
