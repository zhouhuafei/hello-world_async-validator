module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended'
  ],
  // 'off' | 'warn' | 'error'
  rules: {
    'node/no-callback-literal': 'off'
  }
}
