module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
      '**/*.(t|j)s',
      '!**/*.spec.ts',
      '!**/*.interface.ts',
      '!**/index.ts',
    ],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapping: {
      '^@/(.*)$': '<rootDir>/$1',
    },
  };