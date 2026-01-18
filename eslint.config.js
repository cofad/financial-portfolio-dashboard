import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': 'error',
      'max-lines-per-function': ['error', { max: 200 }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.meta.name='import'][property.name='env']",
          message:
            "Do not access 'import.meta.env' directly. Use the central src/services/env.ts instead to ensure type safety and validation.",
        },
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message:
            "Do not use 'process.env'. Vite uses 'import.meta.env', but both should be abstracted into a config file.",
        },
      ],
    },
  },
]);
