import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on(
        "before:browser:launch",
        (
          browser = {
            name: "",
            family: "chromium",
            channel: "",
            displayName: "",
            version: "",
            majorVersion: "",
            path: "",
            isHeaded: false,
            isHeadless: false,
          },
          launchOptions
        ) => {
          if (browser.family === "chromium" && browser.name !== "electron") {
            // auto open devtools
            launchOptions.args.push("--enable-precise-memory-info");
          }

          return launchOptions;
        }
      );
    },
    numTestsKeptInMemory: 20,
    screenshotOnRunFailure: false,
    specPattern: "cypress/e2e/",
    defaultCommandTimeout: 50000,
    pageLoadTimeout: 50000,
    requestTimeout: 50000,
    responseTimeout: 50000,
    viewportHeight: 1080,
    viewportWidth: 1920,
    waitForAnimations: true,
    video: false,
    chromeWebSecurity: false,
    //experimentalCspAllowList: ['default-src', 'child-src', 'frame-src', 'script-src', 'script-src-elem', 'form-action'],
    experimentalCspAllowList: true,
  },
  env: {
    OrgId: 1,
  },
});
