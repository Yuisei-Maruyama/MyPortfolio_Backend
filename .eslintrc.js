module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugin: ['@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: { "no-param-reassign": ["error", { "props": true }] }
}
