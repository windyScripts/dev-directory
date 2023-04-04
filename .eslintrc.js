module.exports = {
  extends: [
    'plugin:import/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['.github', 'dist'],
  root: true,
  env: {
    node: true,
  },
  rules: {
    // Disable base rules to avoid @typescript-eslint conflicts
    'brace-style': 'off',
    'comma-dangle': 'off',
    indent: 'off',
    'key-spacing': 'off',
    'keyword-spacing': 'off',
    'no-unused-vars': 'off',
    'object-curly-spacing': 'off',
    'padding-line-between-statements': 'off',
    semi: 'off',
    'space-before-blocks': 'off',
    'space-infix-ops': 'off',

    // Basic rules
    // `ts-lint: indent` has known issues, we can remove if it becomes a problem...
    // https://github.com/typescript-eslint/typescript-eslint/issues/1824
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
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error',
    '@typescript-eslint/semi': 'error',

    // Quote rules
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],

    // TypeScript rules
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/no-explicit-any': 'error',

    // Comma rules
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',
    'comma-style': ['error', 'last'],

    // End of file/trailing space rules
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'no-trailing-spaces': 'error',

    // Keyword/operator spacing rules
    '@typescript-eslint/keyword-spacing': 'error',
    '@typescript-eslint/space-infix-ops': 'error',

    // Brace/parenthesis spacing rules
    'array-bracket-spacing': ['error', 'never'],
    'array-bracket-newline': ['error', 'consistent'],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': 'error',
    '@typescript-eslint/brace-style': 'error',
    '@typescript-eslint/key-spacing': 'error',
    'object-curly-newline': ['error', { consistent: true }],
    '@typescript-eslint/object-curly-spacing': ['error', 'always', { objectsInObjects: false }],
    'object-shorthand': ['error', 'always', { avoidQuotes: true }],
    'padded-blocks': ['error', 'never'],
    '@typescript-eslint/space-before-blocks': 'error',
    'space-in-parens': ['error', 'never'],

    // Newline padding rules
    '@typescript-eslint/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'any', prev: 'export', next: 'export' },
      { blankLine: 'always', prev: 'directive', next: '*' },
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
