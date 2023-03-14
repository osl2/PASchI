///<reference types="cypress" />
import { contains } from "html2canvas/dist/types/core/bitwise";

describe("add course test", () => {
  const user = {
    firstName: "Testvorname",
    lastName: "Testnachname",
    email: "test@kit.edu",
    password: "12345678",
  };
  it("tests adding a course", () => {
    const course = { name: "Klasse 10b", subject: "Informatik" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("courses");
    cy.addCourse(course.name, course.subject);
    cy.sideMenuTo("courses");
    cy.get(".v-list-item").should("contain", course.name).and("contain", course.subject);
    cy.sideMenuTo("dashboard");
    cy.logOut();
  });
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
    cy.get("button[name=cancelNewCourse]").click();
    cy.sideMenuTo("dashboard");
    cy.logOut();
  });
});
