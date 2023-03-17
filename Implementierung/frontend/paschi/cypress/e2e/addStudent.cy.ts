///<reference types="cypress" />
import {user} from "../support/commands";

describe("add student test", () => {
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
