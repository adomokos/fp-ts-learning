module.exports = {
    collectCoverageFrom: [
        "src/**/*.ts*",
    ],
    preset: "ts-jest",
    testEnvironment: "node",
    transformIgnorePatterns: ['/node_modules/']
    // reporters: ["jest-progress-bar-reporter"],
};
