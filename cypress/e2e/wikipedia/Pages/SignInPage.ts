/// <reference types="cypress" />

import MainPage from "./MainPage";

class SignInPage {
  email : string;
  password: string;
  btnSignIn: string;
  constructor() {
    this.email = "#wpName1";
    this.password = "#wpPassword1";
    this.btnSignIn = "#wpLoginAttempt";
    cy.get(this.email);
  }

  SignIn(userName, password) {
    cy.get(this.email).type(userName);
    cy.get(this.password).type(password);
    cy.get(this.btnSignIn).click();
    return new MainPage();
  }
}
export default SignInPage;
