///<reference types="cypress" />
import { contains } from "html2canvas/dist/types/core/bitwise";

describe("add and then edit course test", () => {
  const user = {
    firstName: "Testvorname",
    lastName: "Testnachname",
    email: "test@kit.edu",
    password: "12345678",
  };
  /**it("tests adding chairs and tables", () => {
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
    cy.logOut();
  });*/
  it("tests drag chairs and tables", () => {
    const room = { name: "123" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("rooms");
    cy.addRoom(room.name);
    const roomCard = cy.get(".v-card[name=room]");
    cy.addChair();
    const chair = cy.get(".v-card[name=room]").get(".v-card[name=chair]");
    chair.drag(200,200);
    cy.get("button[name=save]").click();
    cy.sideMenuTo("dashboard");
    cy.logOut();
  });
});
