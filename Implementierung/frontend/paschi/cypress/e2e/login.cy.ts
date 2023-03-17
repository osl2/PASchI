///<reference types="cypress" />
import {user} from "../support/commands";
import {admin} from "../support/commands";

describe("Login test", () => {
  it("tests input of email and password and successful admin- login", () => {
    cy.visit("/login");
    cy.adminLogin(admin.email, admin.password);
    cy.logOut();
  });
  it("tests input of email and password and successful user- login", () => {
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.logOut();
  });
  it("tests input of email and password and unsuccessful admin- login", () => {
    cy.visit("/login");
    cy.get("input[name='email']").type(admin.email);
    cy.get("input[name='password']").type("incorrect password");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/login");
  });
  it("tests input of email and password and unsuccessful user- login", () => {
    cy.visit("/login");
    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='password']").type("incorrect password");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/login");
  });
});
