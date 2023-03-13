///<reference types="cypress" />

describe("Navigation test", () => {
  const user = {
    firstName: "Testvorname",
    lastName: "Testnachname",
    email: "test@kit.edu",
    password: "12345678",
  };
  it("tests navigation-bar in mobile version", () => {
    cy.viewport(500, 1000)
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.navDropDownTo("students");
    cy.navDropDownTo("courses");
    cy.navDropDownTo("settings");
    cy.navDropDownTo("dashboard");
    cy.logOut();
  });
  it("tests navigation-bar in desktop", () => {
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.navBarTo("students");
    cy.navBarTo("courses");
    cy.navBarTo("rooms");
    cy.navBarTo("settings");
    cy.navBarTo("dashboard");
    cy.logOut();
  });
});
