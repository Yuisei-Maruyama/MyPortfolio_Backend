import express from 'express'
import { fetchSteps, getStep, createStep, updateStep, deleteStep } from './steps'

export const router = express.Router()

fetchSteps()
getStep()
createStep()
updateStep()
deleteStep()
