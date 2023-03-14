///<reference types="cypress" />
import { contains } from "html2canvas/dist/types/core/bitwise";

describe("add student test", () => {
  const user = {
    firstName: "Testvorname",
    lastName: "Testnachname",
    email: "test@kit.edu",
    password: "12345678",
  };
  it("tests adding a student", () => {
    const student = { firstName: "Max", lastName: "Mustermann" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("students");
    cy.addStudent(student.firstName, student.lastName);
    cy.get(".v-list-item")
      .contains(student.firstName)
      .contains(student.lastName);
    cy.sideMenuTo("dashboard");
    cy.logOut();
  });
  it("tests cancel adding a student", () => {
    const student = { firstName: "Max", lastName: "Mustermann" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("students");
    cy.get(".v-toolbar").within(() => {
      cy.get("button[name=createStudent]").click();
    });
    cy.get("input[name=firstName]").type(student.firstName);
    cy.get("input[name=lastName]").type(student.lastName);
    cy.get("button[name=cancelNewStudent]").click();
    cy.sideMenuTo("dashboard");
    cy.logOut();
  });
});
