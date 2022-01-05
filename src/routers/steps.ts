import express from 'express'
import Step from '../models/step'

const router = express.Router()

router.get('/steps', async (req, res, next) => {
  const result = await Step.find({
    id: "61d5c209f96e6cb2faadbfaf"
  })
  res.json(result)
})
