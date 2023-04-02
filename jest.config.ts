import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules'],
  testEnvironment: 'node',
  testMatch: [
    '/dist/**/__tests__/**/*.+(ts|tsx|js)',
    //'**/__tests__/**/*.+(ts|tsx|js)',
    //'**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { diagnostics: false }],
  },
  moduleNameMapper: {
    '^server/(.*)': '<rootDir>/server/$1',
    '^shared/(.*)': '<rootDir>/shared/$1',
  },
  roots: [
    './server',
    './shared',
  ],
  modulePathIgnorePatterns: [
    './cypress',
  ],
};

export default config;
