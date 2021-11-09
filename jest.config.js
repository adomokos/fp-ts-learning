module.exports = {
    roots: [
    "<rootDir>/src"
    ],
    collectCoverageFrom: [
        "src/**/*test.ts*",
    ],
    preset: "ts-jest",
    testEnvironment: "node",
    transformIgnorePatterns: ['/node_modules/'],
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    // reporters: ["jest-progress-bar-reporter"],
};
