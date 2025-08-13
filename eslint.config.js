import js from '@eslint/js'
import react from 'eslint-plugin-react'

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { react },
    languageOptions: {
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }
    },
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  }
]
