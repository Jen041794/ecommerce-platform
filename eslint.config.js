import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // 純 JS 專案、未採用 PropTypes，關閉型別宣告要求（非 bug，屬風格）
      'react/prop-types': 'off',
      // 允許 JSX 顯示文字中刻意使用的全形空格（中文排版），仍攔截程式碼中的怪空白
      'no-irregular-whitespace': ['error', { skipJSXText: true }],
    },
  },
])
