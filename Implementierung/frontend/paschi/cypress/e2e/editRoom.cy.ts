///<reference types="cypress" />
import {user} from "../support/commands";

describe("add and then edit course test", () => {
  it("tests adding chairs and tables", () => {
    const room = { name: "123" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("rooms");
    cy.addRoom(room.name);
    const roomCard = cy.get(".v-card[name=room]");
    roomCard.get(".v-card[name=chair]").should("not.exist");
    roomCard.get(".v-card[name=table]").should("not.exist");
    cy.addChair();
    roomCard.get(".v-card[name=chair]").should("have.length", 1);
    roomCard.get(".v-card[name=table]").should("not.exist");
    cy.addTable();
    roomCard.get(".v-card[name=chair]").should("have.length", 1);
    roomCard.get(".v-card[name=table]").should("have.length", 1);
    cy.addChair();
    roomCard.get(".v-card[name=chair]").should("have.length", 2);
    roomCard.get(".v-card[name=table]").should("have.length", 1);
    cy.addTable();
    roomCard.get(".v-card[name=chair]").should("have.length", 2);
    roomCard.get(".v-card[name=table]").should("have.length", 2);
    cy.get("button[name=save]").click();
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
  it("tests drag chairs", () => {
    const room = { name: "123" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("rooms");
    cy.addRoom(room.name);
    const roomCard = cy.get(".v-card[name=room]");
    cy.addChair();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=chair]")
      .dragAssertSuccess(100, 100)
      .dragAssertSuccess(300, 300)
      .dragAssertSuccess(100, 200)
      .dragAssertSuccess(200, 100)
      .dragAssertSuccess(200, 200);
    cy.addChair();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=chair]")
      .last()
      .dragAssertSuccess(100, 200);
    cy.addChair();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=chair]")
      .last()
      .dragAssertSuccess(100, 100);
    cy.addChair();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=chair]")
      .last()
      .dragAssertCollision(100, 100);
    cy.get("button[name=save]").click();
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
  it("tests drag tables and chairs", () => {
    const room = { name: "123" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("rooms");
    cy.addRoom(room.name);
    cy.addTable();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=table]")
      .dragAssertSuccess(200, 200)
      .dragAssertSuccess(300, 300)
      .dragAssertSuccess(100, 250)
      .dragAssertSuccess(250, 100)
      .dragAssertSuccess(250, 250);
    cy.addTable();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=table]")
      .last()
      .dragAssertSuccess(100, 250);
    cy.addTable();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=table]")
      .last()
      .dragAssertSuccess(100, 100);
    cy.addTable();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=table]")
      .last()
      .dragAssertCollision(100, 100);
    cy.get("button[name=save]").click();
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
  it("tests drag and chairs", () => {
    const room = { name: "123" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("rooms");
    cy.addRoom(room.name);
    cy.addTable();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=table]")
      .dragAssertSuccess(100, 100)
      .dragAssertSuccess(300, 300)
      .dragAssertSuccess(100, 250)
      .dragAssertSuccess(250, 100)
      .dragAssertSuccess(250, 250);
    cy.addChair();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=chair]")
      .last()
      .dragAssertSuccess(100, 250);
    cy.addChair();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=chair]")
      .last()
      .dragAssertSuccess(100, 100);
    cy.addTable();
    cy.get(".v-card[name=room]")
      .get(".v-card[name=table]")
      .last()
      .dragAssertCollision(100, 100);
    cy.get("button[name=save]").click();
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
});
