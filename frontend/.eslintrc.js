module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es2021: true,
      jquery: true
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
        "camelcase": "off",
        "@typescript-eslint/naming-convention": [
          "error",
          { "selector": ['variable', 'function', 'interface'], "format": ["snake_case"] }
        ]
    }
  }