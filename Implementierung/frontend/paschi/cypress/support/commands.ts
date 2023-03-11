// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Must be declared global to be detected by typescript (allows import/export)
// eslint-disable @typescript/interface-name
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      adminLogin(eMail: string, password: string): void;
      userLogin(eMail: string, password: string): void;
      logOut(): void;
    }
  }
}

Cypress.Commands.add('adminLogin', (email, password) => {
  cy.url().should("include", "/login");
  cy.get("input[name='email']").type(email);
  cy.get("input[name='password']").type(password);
  cy.get("button[type=submit]").click();
  cy.url().should("include", "/admin");
  cy.contains("Akzeptierte Accounts");
  cy.contains("Accountanträge");
  cy.contains("Administratorseite");
  cy.contains("Abmelden");
});
Cypress.Commands.add('userLogin', (email, password) => {
  cy.url().should("include", "/login");
  cy.get("input[name='email']").type(email);
  cy.get("input[name='password']").type(password);
  cy.get("button[type=submit]").click();
  cy.url().should("include", "/dashboard");
  cy.contains("Kürzlich verwendete Kurse");
  cy.contains("Letzte Sitzungen");
  cy.contains("Abmelden");
  cy.contains("Alle anzeigen");
});

Cypress.Commands.add('logOut', () => {
  cy.contains("Abmelden");
  cy.get("button").contains("Abmelden").click();
  cy.url().should("include", "/login");
});



// Convert this to a module instead of script (allows import/export)
export {}
