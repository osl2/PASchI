///<reference types="cypress" />
import {user} from "../support/commands";

describe("add student test", () => {
  before(() => {
    cy.resetTestAccount();
  })
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
    cy.get(".v-list-item").contains(student.firstName).should("have.length", 0)
    cy.get(".v-list-item").contains(student.lastName).should("have.length", 0);
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
  it("tests adding a student", () => {
    const student = { firstName: "Max", lastName: "Mustermann" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("students");
    cy.addStudent(student.firstName, student.lastName);
    cy.get(".v-list-item")
      .contains(student.firstName)
      .contains(student.lastName);
    cy.get(".v-list-item").contains(student.firstName).contains(student.lastName).should("have.length", 1);
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
});
