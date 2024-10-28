module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', 
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
    collectCoverage: true,
    collectCoverageFrom: [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/index.ts",
    ],
    coverageReporters: ["text", "lcov"],
    coverageDirectory: "coverage",
};
