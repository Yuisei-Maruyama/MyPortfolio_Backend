import mongoose from 'mongoose'

const reactSteps = [
  'create-react-app',
  'tsx',
  'react-router-dom',
  'material ui',
  'Custom Hooks',
  'styled-components',
  'React 18.x Features',
  'OAuth',
  'Unit Test',
  'Apollo-Client',
]

const hooksSteps = ['useState', 'useEffect', 'useRef', 'useCallback', 'useMemo', 'useContext', 'useReducer']

const reduxSteps = ['flux-flow', 'ducks-pattern', 're-ducks-pattern', 'redux-thunk', 'redux-saga']

const vueSteps = ['Atomic Design', 'Vuetify', 'Vue-Router', 'Vuex', 'Vue 3.x Features']

const nodeSteps = ['Connect DB', 'CRUD', 'OAuth', 'NPM Version Management', 'GraphQL', 'Apollo']

const openApiSteps = ['API Design', 'operationId Definition', 'OpenAPI Extensions']


const schema  = new mongoose.Schema({
  name: String,
  steps: Array,
  activeStep: Number
})

const Step = mongoose.model('Step', schema)

export default Step
