module.exports = {
    testEnvironment: "node",
    setupFilesAfterEnv: [ "./jest.setup.js"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.js", "!src/**/*.test.js"], 
    coverageDirectory: "coverage", // Optional: Set the output directory
    coverageReporters: ["json", "lcov", "text", "clover"] // Choose your preferred formats      
};