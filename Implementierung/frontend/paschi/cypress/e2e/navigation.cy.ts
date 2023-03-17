///<reference types="cypress" />
import {user} from "../support/commands";

describe("Navigation test", () => {
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
