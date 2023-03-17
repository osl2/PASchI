///<reference types="cypress" />
import {user} from "../../support/commands";
describe("add course test", () => {
  before(() => {
    cy.resetTestAccount();
  })
  it("tests scenario 3", () => {
    const course = { name: "Klasse 10b", subject: "Informatik" };
    const students = Array.of(
      { firstName: "Anna", lastName: "Bolika" },
      { firstName: "Reiner", lastName: "Zufall" },
      { firstName: "Polly", lastName: "Zist" },
      { firstName: "Frank", lastName: "Reich" },
      { firstName: "Lang", lastName: "Fall" },
    );
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.url().should("include", "/dashboard");
    cy.sideMenuTo("courses");
    cy.addCourse(course.name, course.subject);
    cy.sideMenuTo("students");
    students.forEach((student)=>{
      cy.addStudent(student.firstName, student.lastName);
    });
    cy.sideMenuTo("courses");
    cy.get(".v-list-item[name=course]").click();
    cy.get("button[name=addStudent]").click();
    students.forEach((student) => {
      cy.get(".v-list-item").contains(student.firstName).and("contain", student.lastName).last().click()
    })
    cy.get(".v-expansion-panel-title[name=newSessionListTitle]").within(()=>{
        cy.get("[name=startLastSeatArrangement]")

      }
    )

    cy.desktopLogOut();
  });
});
