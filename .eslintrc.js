module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript',
    'plugin:sonarjs/recommended'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'only-multiline'],
    '@typescript-eslint/no-unused-vars': [2, { args: 'none' }]
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
};
