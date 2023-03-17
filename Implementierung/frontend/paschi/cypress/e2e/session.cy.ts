///<reference types="cypress" />
import {user} from "../support/commands";
describe("add course test", () => {
  it("tests adding a course", () => {
    const course = { name: "Klasse 10b", subject: "Informatik" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("courses");
    cy.addCourse(course.name, course.subject);
    cy.sideMenuTo("courses");
    cy.get(".v-list-item").should("contain", course.name).and("contain", course.subject);
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
});
