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
        activeStep: req.body.activeStep,
        steps: req.body.steps
      })
      await result.save()
      res.json(result)
    } catch {
      exit("Not created.", 1)
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

export function updateStep() {
  router.patch('/step/:id', async (req: Request, res: Response) => {
    try {
      const result = await Step.findOne({ _id: req.params.id })
      if (!result) return
      if (req.body.name) (result as unknown as { name: string }).name = req.body.name
      if (req.body.activeStep) (result as unknown as { activeStep: number }).activeStep = req.body.activeStep
      if (req.body.steps) (result as unknown as { steps: string[] }).steps = req.body.steps
      await result.save()
      res.json(result)
    } catch {
      exit('Not updated.', 1)
    }
  })
}

export function deleteStep() {
  router.delete('/step/:id', async (req: Request, res: Response) => {
    try {
      await Step.deleteOne({ _id: req.params.id })
      res.json({ "message": "step has been deleted." })
    } catch {
      exit('Not deleted.', 1)
    }
  })
}
