module.exports = {
  extends: [
    'plugin:import/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['.github', 'server/migrations', 'dist'],
  root: true,
  env: {
    node: true,
  },
  rules: {
    // Basic rules
    indent: ['error', 2, { SwitchCase: 1 }],
    'max-len': ['warn', 120],
    'prefer-const': 'error',
    semi: ['error', 'always'],

    // Quote rules
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],

    // TypeScript rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',

    // Comma rules
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',
    'comma-style': ['error', 'last'],

    // End of file/trailing space rules
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'no-trailing-spaces': 'error',

    // Brace/parenthesis spacing rules
    'array-bracket-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': 'error',
    'brace-style': 'off',
    '@typescript-eslint/brace-style': 'error',
    'key-spacing': 'off',
    '@typescript-eslint/key-spacing': 'error',
    'object-curly-spacing': ['error', 'always', { objectsInObjects: false }],
    'object-shorthand': ['error', 'always', { avoidQuotes: true }],
    'space-before-blocks': 'off',
    '@typescript-eslint/space-before-blocks': 'error',
    'space-in-parens': ['error', 'never'],

    // Newline padding rules
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'any', prev: 'export', next: 'export' },
    ],

    // Import rules
    'import/newline-after-import': 'error',
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
      ],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],
  },
  overrides: [{
    files: ['server/migrations/*.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': 0,
    },
  }],
  settings: {
    'import/resolver': {
      typescript: true,
      node: {
        paths: ['./'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};

