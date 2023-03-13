///<reference types="cypress" />
describe("add student test", () => {
  const user = { firstName: "Testvorname", lastName: "Testnachname", email: "test@kit.edu", password: "12345678" };
  it("tests input of email and password and successful admin- login", () => {
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("students")
    cy.addStudent("Max", "Mustermann");
    cy.logOut();
  });

});
