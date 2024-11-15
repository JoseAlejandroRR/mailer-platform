
const config = {
  roots: ['<rootDir>/src', '<rootDir>/src/__tests__'],
  "reporters": [
    "default",
    [
      "jest-stare",
      {
        "resultDir": "tdd-reports/jest-stare",
        "reportTitle": "Backend Unit Test",
        "coverageLink": "../../tdd-reports/coverage/lcov-report/index.html",
        "hidePassing": false,
        "hidePending": false,
        "hideTodo": false,
        "hideFailing": false,
      }
    ]
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  testPathIgnorePatterns: [
    "/node_modules/",
  ],

  collectCoverage: true,
  coverageDirectory: './tdd-reports/coverage',
  testTimeout: 1000 * 30,
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/__tests__/mocks/'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/__tests__/mocks/'],
};

module.exports = config;