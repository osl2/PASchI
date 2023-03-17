///<reference types="cypress" />
import { user } from "../../support/commands";
describe("add course test", () => {
  before(() => {
    cy.resetTestAccount();
  });
  it("tests scenario 1", () => {
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
});
