import { Request, Response, NextFunction } from 'express'
import { router } from './index'
import Step from '../models/step'
import { exit } from '..'

export function fetchSteps() {
  try {
    router.get('/steps', async (req: Request, res: Response, next: NextFunction) => {
      const result = await Step.find()
      res.json(result)
    })
  } catch {
    exit('Not found.', 1)
  }
}

export function createStep() {
  router.post('/step', async (req: Request, res: Response) => {
    try {
      const result = new Step({
        name: req.body.name,
        activeSteps: req.body.activeSteps,
        steps: req.body.steps
      })
      await result.save()
      res.json(result)
    } catch {
      exit("Not Can't created.", 1)
    }
  })
}

export function getStep() {
  router.get('/step/:id', async (req, res) => {
    try {
      const result = await Step.findOne({ _id: req.params.id })
      res.json(result)
    } catch {
      exit('Not found.', 1)
    }
  })
}
