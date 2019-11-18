const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$';

const PATH_DELIMITER = '[\\\\/]'; // match 2 antislashes or one slash

/**
 * On Windows, the Regex won't match as Webpack tries to resolve the
 * paths of the modules. So we need to check for \\ and /
 */
const safePath = item => item.split('/').join(PATH_DELIMITER);

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
