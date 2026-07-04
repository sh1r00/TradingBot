import nuxtEslintConfig from '@nuxt/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier'
import vuejsAccessibility from 'eslint-plugin-vuejs-accessibility'

export default [
  ...nuxtEslintConfig,
  vuejsAccessibility.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    rules: {
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/',
      '.nuxt/',
      '.output/',
      'dist/',
      'app/assets/css/material-tokens.css',
    ],
  },
]
