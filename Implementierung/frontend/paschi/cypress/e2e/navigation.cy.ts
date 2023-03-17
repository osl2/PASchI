///<reference types="cypress" />
import {user} from "../support/commands";

describe("Navigation test", () => {
  before(() => {
    cy.resetTestAccount();
  })
  it("tests navigation-bar in mobile version", () => {
    cy.viewport(500, 1000)
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.navDropDownTo("students");
    cy.navDropDownTo("courses");
    cy.navDropDownTo("settings");
    cy.navDropDownTo("dashboard");
    cy.mobileLogOut();
  });
  it("tests navigation-bar in desktop", () => {
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("students");
    cy.sideMenuTo("courses");
    cy.sideMenuTo("rooms");
    cy.sideMenuTo("settings");
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
});
