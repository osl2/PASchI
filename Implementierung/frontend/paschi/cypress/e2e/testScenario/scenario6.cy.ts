///<reference types="cypress" />
import {user} from "../../support/commands";
describe("add course test", () => {
  before(() => {
    cy.resetTestAccount();
  })
  it("tests scenario 6", () => {
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
        cy.get("[name=startLastSeatArrangement]").click()
      }
    )
    cy.viewport(999, 660)
    cy.get("div[name=seatLabel]").contains(students[0].firstName).and("contain", students[0].lastName).last().click().get("div[name=seatLabel]").contains(students[1].firstName).and("contain", students[1].lastName).click();
    cy.get("[name=category]").contains("Störung").click();
    cy.wait(1000)
    cy.get("div[name=seatLabel]").contains(students[1].firstName).and("contain", students[1].lastName).last().click().get("div[name=seatLabel]").contains(students[0].firstName).and("contain", students[0].lastName).click();
    cy.get("[name=category]").contains("Störung").click();
    cy.wait(1000)
    cy.get("div[name=seatLabel]").contains(students[2].firstName).and("contain", students[2].lastName).last().click().get("div[name=seatLabel]").contains(students[3].firstName).and("contain", students[3].lastName).click();
    cy.get("[name=category]").contains("Störung").click();
    cy.wait(1000)
    cy.get("div[name=seatLabel]").contains(students[2].firstName).and("contain", students[2].lastName).last().click().get("div[name=seatLabel]").contains(students[0].firstName).and("contain", students[0].lastName).click();
    cy.get("[name=category]").contains("Störung").click();
    cy.wait(1000)
    cy.get("div[name=seatLabel]").contains(students[1].firstName).and("contain", students[1].lastName).last().click().get("div[name=seatLabel]").contains(students[0].firstName).and("contain", students[0].lastName).click();
    cy.get("[name=category]").contains("Störung").click();
    cy.wait(1000)
    cy.get("div[name=seatLabel]").contains(students[0].firstName).and("contain", students[0].lastName).last().click().get("div[name=seatLabel]").contains(students[1].firstName).and("contain", students[1].lastName).click();
    cy.get("[name=category]").contains("Störung").click();
    cy.wait(1000)
    cy.get("div[name=seatLabel]").contains(students[1].firstName).and("contain", students[1].lastName).last().click().get("div[name=seatLabel]").contains(students[0].firstName).and("contain", students[0].lastName).click();
    cy.get("[name=category]").contains("Störung").click();
    cy.wait(1000)
    cy.get("div[name=seatLabel]").contains(students[2].firstName).and("contain", students[2].lastName).last().click().get("div[name=seatLabel]").contains(students[3].firstName).and("contain", students[3].lastName).click();
    cy.get("[name=category]").contains("Störung").click();
    cy.wait(1000)
    cy.get("div[name=seatLabel]").contains(students[2].firstName).and("contain", students[2].lastName).last().click().get("div[name=seatLabel]").contains(students[0].firstName).and("contain", students[0].lastName).click();
    cy.get("[name=category]").contains("Störung").click();
    cy.wait(1000)
    cy.get("div[name=seatLabel]").contains(students[1].firstName).and("contain", students[1].lastName).last().click().get("div[name=seatLabel]").contains(students[0].firstName).and("contain", students[0].lastName).click();
    cy.get("[name=category]").contains("Störung").click();
    cy.viewport(1000, 660)
    cy.get("button").contains("Sitzung beenden").click()
    cy.get("[name=recentCoursesCard]").within(()=>{
      cy.get("[name=interactionMap]").click();
    })
    cy.get("button").click()
    cy.get("[name=recentCoursesCard]").within(()=>{
      cy.get("[name=statistics]").click();
    })

    cy.sideMenuTo("courses");
    cy.get(".v-list-item[name=course]").click();
    cy.get(".v-expansion-panel-title[name=studentListTitle]").click()
    cy.get("[name=studentStatistic]").last()


    cy.desktopLogOut();
  });
});
