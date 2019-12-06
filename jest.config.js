const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$';

module.exports = {
    testEnvironment: 'jsdom',
    testRegex: TEST_REGEX,
    coverageReporters: ['lcov', 'text'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    transform: {
        '^.+\\.(js|ts)x?$': 'ts-jest',
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/*.config.js/', '<rootDir>/*.setup.js/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
