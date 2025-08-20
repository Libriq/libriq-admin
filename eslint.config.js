// eslint.config.js (flat config for ESLint v9)
import js from '@eslint/js';
import * as tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

export default [
  // Replaces .eslintignore
  {
    ignores: [
      'dist', 'node_modules', '.firebase', 'firebase-debug.log',
      'functions/lib', 'coverage'
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules (non type-aware; switch to recommendedTypeChecked later if you want)
  ...tseslint.configs.recommended,

  // Astro flat recommended (NOTE: must spread because it's an array)
  ...astro.configs['flat/recommended'],

  // Ensure .astro uses the Astro parser + TS parser for scripts
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
      },
    },
  },

  // React/TSX rules
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: { react, 'react-hooks': reactHooks, import: importPlugin },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/order': ['warn', { 'newlines-between': 'always' }],
    },
  },
];
