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
    semi: ['error', 'always'],
    'no-trailing-spaces': 'error',
    indent: ['error', 2, { SwitchCase: 1 }],
    'comma-dangle': ['error', 'always-multiline'],
    quotes: ['error', 'single'],
    'max-len': ['warn', 120],
    'prefer-const': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'quote-props': ['error', 'as-needed'],
    'eol-last': ['error', 'always'],
    'comma-style': ['error', 'last'],
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'always', { objectsInObjects: false }],
    'space-in-parens': ['error', 'never'],
    'import/order': [
      'error',
      {
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
      },
    ],
  },
  overrides: [
    {
      files: ['server/migrations/*.js'],
      rules: {
        '@typescript-eslint/no-unused-vars': 0,
      },
    },
  ],
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
