export default {
    collectCoverage: true,
    extensionsToTreatAsEsm: ['.ts'],
    globals: { 'ts-jest': { useESM: true } },
    modulePathIgnorePatterns: ['<rootDir>/lib'],
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
};
