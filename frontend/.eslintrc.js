module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es2021: true
    },
    extends: [
      'standard'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest'
    },
    plugins: [
      '@typescript-eslint'
    ],
    rules: {
        "no-undef": "off"
    }
  }