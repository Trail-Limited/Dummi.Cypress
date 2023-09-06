/// <reference types="cypress" />

import SignInPage from "./SignInPage";

class LandingPage {
  // Page Elements
  signIn = "#pt-login-2";

  constructor() {
    cy.get(this.signIn);
  }

  // Page Actions
  NavigateToSignInPage() {
    cy.get(this.signIn).click();
    return new SignInPage();
  }
}
export default LandingPage;
