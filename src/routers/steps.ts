import { Request, Response, NextFunction } from 'express'
import { router } from './index'
import Step from '../models/step'

export function getSteps() {
  router.get('/steps', async (req: Request, res: Response, next: NextFunction) => {
    const result = await Step.find()
    res.json(result)
  })
}

