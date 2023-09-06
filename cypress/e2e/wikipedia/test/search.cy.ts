///<reference types="cypress" />;

import LandingPage from "../Pages/LandingPage";

Cypress.on('resource:response', (response) => {
  console.log("abc");
  if (response.headers['content-security-policy']) {
    delete response.headers['content-security-policy'];
  }
});

describe("Test-Wikipedia", () => {
  before(() => {
  });

  beforeEach(() => {
    cy.visit("https://www.wikipedia.org/").then(() => {
   });
    cy.get("#js-link-box-en").click();
    Cypress.on("uncaught:exception", (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });
  });
    it('waits for promises to resolve', () => {
    cy.get("head").then(() => {
      const script = document.createElement('script');
      script.type = "module";
      script.src = "http://localhost:4300/snippet.js";
      document.getElementsByTagName("head")[0].append(script);
    })
  });

  it("Watchlist test", () => {
    const wkUsername = Cypress.env("wk_username");
    const wkPassword = Cypress.env("wk_password");
    var landingPage = new LandingPage();
    var signInPage = landingPage.NavigateToSignInPage();
    var mainPage = signInPage.SignIn(wkUsername, wkPassword);
    mainPage.SearchAndAddToWatchList();
    mainPage.RemoveFromWatchList();
    mainPage.returnToWatchLictAndValidate();
  });

  afterEach(() => {
    cy.get("input[value='Software testing']").click();
    cy.get("button[value='Remove titles']").click();
  });
});
