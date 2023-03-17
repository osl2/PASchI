///<reference types="cypress" />
import {user} from "../support/commands";

describe("add course test", () => {
  const course = { name: "Klasse 10b", subject: "Informatik" };
  before(() => {
    cy.resetTestAccount();
  })
  it("tests changing course name and course subject", () => {
    const newCourse = { name: "Klasse 11a", subject: "Mathe" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("courses");
    cy.addCourse(course.name, course.subject);
    cy.get("[name=editCourseDetails]").click();
    cy.get("input[name=name]").clear().type(newCourse.name)
    cy.get("input[name=subject]").clear().type(newCourse.subject)
    cy.get("button[name=save]").click()
    cy.sideMenuTo("courses")
    cy.get(".v-list-item").contains(course.name).should("have.length", 0)
    cy.get(".v-list-item").contains(course.subject).should("have.length", 0)
    cy.get(".v-list-item").contains(newCourse.name).should("have.length", 1)
    cy.get(".v-list-item").contains(newCourse.subject).should("have.length", 1)
    cy.desktopLogOut();
  })
  it("tests change course name and course subject but not save", () => {
    const newCourse = { name: "Klasse 11a", subject: "Mathe" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("courses");
    cy.addCourse(course.name, course.subject);
    cy.get("[name=editCourseDetails]").click();
    cy.get("input[name=name]").clear().type(newCourse.name)
    cy.get("input[name=subject]").clear().type(newCourse.subject)
    cy.sideMenuTo("courses")
    cy.get(".v-list-item").contains(course.name).should("have.length", 1)
    cy.get(".v-list-item").contains(course.subject).should("have.length", 1)
    cy.desktopLogOut();
  })
  it("tests adding students to a course", () => {
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
    students.forEach((student) => {
      cy.get(".v-list-item").contains(student.firstName).and("contain", student.lastName).last().click()
    })
    cy.get(".v-expansion-panel-title[name=studentListTitle]").click()
    students.forEach((student) => {
      cy.get("[name=student]").contains(student.firstName).and("contain", student.lastName)
    })
    cy.desktopLogOut();
  });
});
