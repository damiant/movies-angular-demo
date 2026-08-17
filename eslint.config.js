const angular = require('@angular-eslint/eslint-plugin');
const template = require('@angular-eslint/eslint-plugin-template');
const templateParser = require('@angular-eslint/template-parser');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  { ignores: ['projects/**/*', 'dist/**/*', 'www/**/*'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@angular-eslint': angular,
      '@angular-eslint/template': template,
    },
    processor: template.processors['extract-inline-html'],
    rules: {
      '@angular-eslint/component-class-suffix': [
        'error',
        { suffixes: ['Page', 'Component'] },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: templateParser,
    },
    plugins: {
      '@angular-eslint/template': template,
    },
    rules: {
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/no-inline-styles': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
    },
  },
];
