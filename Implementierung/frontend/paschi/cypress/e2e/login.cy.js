///<reference types="cypress" />
const user = { email: "admin@kit.edu", password: "admin" };

describe("Login test", () => {
  it("tests input of email and password and successful login", () => {
    cy.visit("/login");
    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='password']").type(user.password);
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/admin");
    cy.contains("Akzeptierte Accounts");
    cy.contains("Accountanträge");
    cy.contains("Administratorseite");
    cy.contains("Abmelden");
    cy.get("button").contains("Abmelden").click();
    cy.url().should("include", "/login");
    cy.clickLink('Buy Now')


  });
});
