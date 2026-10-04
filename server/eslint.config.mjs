import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['logs', 'node_modules', 'coverage', 'postman', 'uploads', '*.log'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
