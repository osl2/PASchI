///<reference types="cypress" />
import {user} from "../../support/commands";
describe("add course test", () => {
  before(() => {
    cy.resetTestAccount();
  })
  it("tests scenario 2", () => {
    const course = { name: "Klasse 10b", subject: "Informatik" };
    const students = Array.of(
      { firstName: "Anna", lastName: "Bolika" },
      { firstName: "Reiner", lastName: "Zufall" },
      { firstName: "Polly", lastName: "Zist" },
      { firstName: "Frank", lastName: "Reich" },
      { firstName: "Lang", lastName: "Fall" },
      { firstName: "Rosa", lastName: "Wurst" },
      { firstName: "Hans", lastName: "Maul" },
      { firstName: "Kai", lastName: "Ser" },
      { firstName: "Heide", lastName: "Witzka" },
      { firstName: "Axel", lastName: "Axel" },
      { firstName: "Peter", lastName: "Petersilie" },
      { firstName: "Mary", lastName: "Huana" },
      { firstName: "Ellen", lastName: "Lang" },
      { firstName: "Harry", lastName: "Bo" },
      { firstName: "Jo", lastName: "Ghurt" }
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
    cy.sideMenuTo("students");
    cy.desktopLogOut();
  });
});
