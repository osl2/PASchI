///<reference types="cypress" />
import {user} from "../support/commands";

describe("add course test", () => {
  before(() => {
    cy.resetTestAccount();
  })
  it("tests adding students to a course", () => {
    const course = { name: "Klasse 10b", subject: "Informatik" };
    const students: ({firstName: string, lastName: string}[]) = Array.of({firstName: "Alice", lastName: "Müller"}, {firstName: "Bob", lastName: "Bohne"}, {firstName: "Liam", lastName: "Schaal"}, {firstName: "Christian", lastName: "Kessel"})
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("courses");
    cy.addCourse(course.name, course.subject);
    cy.sideMenuTo("students");
    students.forEach((student) => {
      cy.addStudent(student.firstName, student.lastName);
    })
    cy.sideMenuTo("courses");
    cy.get(".v-list-item").should("contain", course.name).and("contain", course.subject).last().click();
    cy.get("button[name=addStudent]").click();
    cy.get(".v-list-item").contains(students[0].firstName).and("contain", students[0].lastName).last().click()
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
});
