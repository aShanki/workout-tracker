const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/components/ui/button$': '<rootDir>/src/tests/__mocks__/ui-components.tsx',
    '^@/components/ui/input$': '<rootDir>/src/tests/__mocks__/ui-components.tsx',
    '^@/components/ui/form$': '<rootDir>/src/tests/__mocks__/ui-components.tsx',
    '^@/components/ui/toast$': '<rootDir>/src/tests/__mocks__/toast.tsx',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['**/*.test.tsx', '**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
};

module.exports = createJestConfig(customJestConfig);