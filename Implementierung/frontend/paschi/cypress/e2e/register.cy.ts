///<reference types="cypress" />
import {user} from "../support/commands";

describe("Register test", () => {
  before(() => {
    cy.resetTestAccount();
  })
  const emptyInputMessage = "Alle Felder müssen ausgefüllt sein.";
  it("tests empty first name", () => {
    cy.visit("/register");
    cy.get("input[name='firstName']");
    cy.get("input[name='lastName']").type(user.lastName);
    cy.get("input[name='mail']").type(user.email);
    cy.get("input[name='password']").type(user.password);
    cy.get("input[name='passwordRepeat']").type(user.password);
    cy.get("button[type=submit]").click();
    cy.contains(emptyInputMessage);
  });
  it("tests empty last name", () => {
    cy.visit("/register");
    cy.get("input[name='firstName']").type(user.firstName);
    cy.get("input[name='lastName']");
    cy.get("input[name='mail']").type(user.email);
    cy.get("input[name='password']").type(user.password);
    cy.get("input[name='passwordRepeat']").type(user.password);
    cy.get("button[type=submit]").click();
    cy.contains("Alle Felder müssen ausgefüllt sein.");
  });
  it("tests empty mail", () => {
    cy.visit("/register");
    cy.get("input[name='firstName']").type(user.firstName);
    cy.get("input[name='lastName']").type(user.lastName);
    cy.get("input[name='mail']");
    cy.get("input[name='password']").type(user.password);
    cy.get("input[name='passwordRepeat']").type(user.password);
    cy.get("button[type=submit]").click();
    cy.contains(emptyInputMessage);
  });
  it("tests empty password", () => {
    cy.visit("/register");
    cy.get("input[name='firstName']").type(user.firstName);
    cy.get("input[name='lastName']").type(user.lastName);
    cy.get("input[name='mail']").type(user.email);
    cy.get("input[name='password']");
    cy.get("input[name='passwordRepeat']").type(user.password);
    cy.get("button[type=submit]").click();
    cy.contains(emptyInputMessage);
  });
  it("tests empty passwordrepeat", () => {
    cy.visit("/register");
    cy.get("input[name='firstName']").type(user.firstName);
    cy.get("input[name='lastName']").type(user.lastName);
    cy.get("input[name='mail']").type(user.email);
    cy.get("input[name='password']").type(user.password);
    cy.get("input[name='passwordRepeat']");
    cy.get("button[type=submit]").click();
    cy.contains(emptyInputMessage);
  });

});
