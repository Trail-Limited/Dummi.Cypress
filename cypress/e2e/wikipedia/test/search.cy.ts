///<reference types="cypress" />;

import LandingPage from "../Pages/LandingPage";

describe("Test-Wikipedia", () => {
  beforeEach(() => {
    cy.visit("https://www.wikipedia.org/");
    cy.get("#js-link-box-en").click();
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
