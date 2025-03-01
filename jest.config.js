module.exports = {
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/))(test|spec)\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
};