// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
require("@cypress/xpath");
// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on("window:before:load", async (win) => {
  console.log("Adding Dummi snippet");
  const doc = win.document;
  const script = doc.createElement("script");
  script.type = "module";
  script.src = "http://localhost:4300/snippet.js";
  doc.getElementsByTagName("head")[0].append(script);
});
