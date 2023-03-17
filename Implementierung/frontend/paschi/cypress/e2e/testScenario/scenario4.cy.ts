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
    students.forEach((student)=>{
      cy.get("[name=student]").contains(student.firstName+" "+student.lastName);
    });
    cy.sideMenuTo("courses");
    cy.get(".v-list-item[name=course]").click();
    cy.get("button[name=addStudent]").click();
    students.forEach((student) => {
      cy.get(".v-list-item").contains(student.firstName).and("contain", student.lastName).last().click()
    })
    cy.get(".v-expansion-panel-title[name=studentListTitle]").click()
    students.forEach((student) => {
      cy.get("[name=student]").contains(student.firstName).and("contain", student.lastName)
    })
    for (let i = 0; i<5; i++) {
      cy.get("[name=student]").contains(students[i].firstName+" "+students[i].lastName).within(()=>{
        cy.get("button[name=remove]").click();
      });
    };
    for (let i = 0; i<5; i++) {
      cy.get("[name=student]").contains(students[i].firstName + " " + students[i].lastName).should("have.length", 0);
    }
    for (let i = 5; i<15; i++) {
      cy.get("[name=student]").contains(students[i].firstName + " " + students[i].lastName).should("have.length", 1);
    }
    cy.desktopLogOut();
  });
});
