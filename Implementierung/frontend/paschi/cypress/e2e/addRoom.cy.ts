///<reference types="cypress" />
import { contains } from "html2canvas/dist/types/core/bitwise";

describe("add course test", () => {
  const user = {
    firstName: "Testvorname",
    lastName: "Testnachname",
    email: "test@kit.edu",
    password: "12345678",
  };
  it("tests adding a room", () => {
    const room = { name: "123" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("rooms");
    cy.addRoom(room.name);
    cy.get("button[name=save").click();
    cy.sideMenuTo("rooms");
    cy.get(".v-list-item").should("contain", room.name);
    cy.sideMenuTo("dashboard");
    cy.logOut();
  });
  it("tests cancel adding a room", () => {
    const room = { name: "123" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("rooms");
    cy.get(".v-toolbar").within(() => {
      cy.get("button[name=createRoom]").click();
    });
    cy.get("input[name=name]").type(room.name);
    cy.get("button[name=cancelNewRoom]").click();
    cy.sideMenuTo("dashboard");
    cy.logOut();
  });
});
