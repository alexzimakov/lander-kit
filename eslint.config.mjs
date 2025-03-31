import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  { ignores: ['dist'] },
  { files: ['**/*.{js,mjs,cjs}'] },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
  { files: ['scripts/**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
  {
    rules: {
      'import/extensions': ['error', 'ignorePackages'],
    },
    plugins: { import: importPlugin },
  },
  stylistic.configs.customize({
    semi: true,
    quoteProps: 'consistent-as-needed',
    braceStyle: '1tbs',
    arrowParens: true,
  }),
]);
