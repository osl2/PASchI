///<reference types="cypress" />
import {user} from "../support/commands";

describe("add course test", () => {
  before(() => {
    cy.resetTestAccount();
  })
  it("tests cancel adding a course", () => {
    const course = { name: "Klasse 10b", subject: "Informatik" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("courses");
    cy.get(".v-toolbar").within(() => {
      cy.get("button[name=createCourse]").click();
    });
    cy.get("input[name=name]").type(course.name);
    cy.get("input[name=subject]").type(course.subject);
    cy.get("button[name=Abbrechen]").click();
    cy.get(".v-list-item").contains("contain", course.name).should("have.length", 0);
    cy.get(".v-list-item").contains("contain", course.subject).should("have.length", 0)
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
  it("tests adding a course", () => {
    const course = { name: "Klasse 10b", subject: "Informatik" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("courses");
    cy.addCourse(course.name, course.subject);
    cy.sideMenuTo("courses");
    cy.get(".v-list-item").contains(course.name).parents(".v-list-item").contains(course.subject).should("have.length", 1);
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
});
