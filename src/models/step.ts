import mongoose from 'mongoose'

const schema  = new mongoose.Schema({
  name: String,
  steps: Array,
  activeStep: Number
})

const Step = mongoose.model('Step', schema)

export default Step
