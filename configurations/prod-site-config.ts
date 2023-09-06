import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "https://vn.gettrail.com",
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        numTestsKeptInMemory: 20,
        specPattern: "cypress/e2e",
        screenshotOnRunFailure: false,
        defaultCommandTimeout: 50000,
        pageLoadTimeout: 50000,
        requestTimeout: 50000,
        responseTimeout: 50000,
        viewportHeight: 1080,
        viewportWidth: 1920,
        waitForAnimations: true,
        video: false
    },
    env: {
        "OrgId": 596
    }
});
