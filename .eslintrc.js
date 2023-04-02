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
    // `ts-lint: indent` has known issues, we can remove if it becomes a problem...
    // https://github.com/typescript-eslint/typescript-eslint/issues/1824
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2, {
      SwitchCase: 1,
      flatTernaryExpressions: false,
      ignoredNodes: [
        'PropertyDefinition[decorators]',
        'TSUnionType',
        'FunctionExpression[params]:has(Identifier[decorators])',
      ],
    }],
    'max-len': ['warn', 120],
    'prefer-const': 'error',
    semi: 'off',
    '@typescript-eslint/semi': 'error',

    // Quote rules
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],

    // TypeScript rules
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-unused-vars': 'off',
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
    'array-bracket-newline': ['error', 'consistent'],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': 'error',
    'brace-style': 'off',
    '@typescript-eslint/brace-style': 'error',
    'key-spacing': 'off',
    '@typescript-eslint/key-spacing': 'error',
    'object-curly-newline': ['error', { consistent: true }],
    'object-curly-spacing': ['error', 'always', { objectsInObjects: false }],
    'object-shorthand': ['error', 'always', { avoidQuotes: true }],
    'padded-blocks': ['error', 'never'],
    'space-before-blocks': 'off',
    '@typescript-eslint/space-before-blocks': 'error',
    'space-in-parens': ['error', 'never'],

    // Newline padding rules
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'any', prev: 'export', next: 'export' },
    ],

    // Import/export rules
    'import/exports-last': 'error',
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

