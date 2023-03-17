///<reference types="cypress" />
import {user} from "../support/commands";

describe("add course test", () => {
  before(() => {
    cy.resetTestAccount();
  })
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
    cy.get(".v-list-item").contains(room.name).should("have.length", 0);
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
  it("tests adding a room", () => {
    const room = { name: "123" };
    cy.visit("/login");
    cy.userLogin(user.email, user.password);
    cy.sideMenuTo("rooms");
    cy.addRoom(room.name);
    cy.get("button[name=save").click();
    cy.sideMenuTo("rooms");
    cy.get(".v-list-item").contains(room.name).should("have.length", 1);
    cy.sideMenuTo("dashboard");
    cy.desktopLogOut();
  });
});
