import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import {defineConfig} from 'eslint/config'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser
    },

    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single', {'allowTemplateLiterals': 'always'}],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'never'],
      'arrow-spacing': ['error', {before: true, after: true}],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
])
