// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Must be declared global to be detected by typescript (allows import/export)
// eslint-disable @typescript/interface-name

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      addChair(): void;

      addTable(): void;

      addRoom(name: string): void;

      addStudent(firstName: string, lastName: string): void;

      addCourse(name: string, subject: string): void;

      resetTestAccount(): void;

      sideMenuTo(
        destination: "dashboard" | "students" | "courses" | "rooms" | "settings"
      ): void;

      navDropDownTo(
        destination: "dashboard" | "students" | "courses" | "settings"
      ): void;

      adminLogin(eMail: string, password: string): void;

      adminLogin(eMail: string, password: string): void;

      userLogin(eMail: string, password: string): void;

      adminLogOut(): void;
      desktopLogOut(): void;
      mobileLogOut(): void;
      drag(x: number, y: number,): Chainable<JQuery<HTMLElement>>;
      dragAssertSuccess(x: number, y: number,): Chainable<JQuery<HTMLElement>>;
      dragAssertCollision(x: number, y: number,): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export const admin = { email: "admin@kit.edu", password: "admin" };
export const user = {
  firstName: "Testvorname",
  lastName: "Testnachname",
  email: "test@kit.edu",
  password: "12345678",
};

Cypress.Commands.add(
  'drag',
  { prevSubject: 'element' },
  (subject /* :JQuery<HTMLElement> */, x: number, y: number) => {
    cy.wrap(subject).trigger("mouseenter").trigger("mousedown");
    cy.get(".v-card[name=room]").trigger('mousemove', x, y ).trigger('mouseup');
    return cy.wrap(subject)
  }
)

Cypress.Commands.add(
  'dragAssertSuccess',
  { prevSubject: 'element' },
  (subject /* :JQuery<HTMLElement> */, x: number, y: number) => {
    cy.wrap(subject).trigger("mouseenter").trigger("mousedown");
    cy.get(".v-card[name=room]").trigger('mousemove', x, y ).get(".error").should("have.length", 0).get(".v-card[name=room]").trigger('mouseup', {force: true});

    return cy.wrap(subject)
  }
)

Cypress.Commands.add(
  'dragAssertCollision',
  { prevSubject: 'element' },
  (subject /* :JQuery<HTMLElement> */, x: number, y: number) => {
    cy.wrap(subject).trigger("mouseenter").trigger("mousedown");
    cy.get(".v-card[name=room]").trigger('mousemove', x, y ).get(".error").should("have.length", 1).get(".v-card[name=room]").trigger('mouseup', {force: true});
    return cy.wrap(subject)
  }
)

Cypress.Commands.add("resetTestAccount", () => {
  ///*
  cy.visit("/login");
  cy.adminLogin(admin.email, admin.password);
  cy.get(".v-card[name=userCard]").within(() => {
    cy.get("button").click();
  });
  cy.get(".v-card[name=userCard]")
    .get("[name=userSearchParameters]")
    .click({ force: true })
    .get(".v-overlay")
    .within(() => {
      cy.get(".v-list-item").contains("E-Mail").click();
    })
    .get("input[name=userSearch]")
    .type(user.email);
  // Cypress bug: cy.get("[name=user]").should('not.have.attr', 'style', 'display: none').first().click()
  cy.get("[name=userEmail]")
    .contains(new RegExp("^" + user.email + "$", "g"))
    .should("have.length", 1)
    .parents("[name=user]")
    .within(() => {
      cy.get("button[name=deleteUser]").click();
    });
  cy.adminLogOut();
//*/
  cy.visit("/register");
  cy.get("input[name='firstName']").type(user.firstName);
  cy.get("input[name='lastName']").type(user.lastName);
  cy.get("input[name='mail']").type(user.email);
  cy.get("input[name='password']").type(user.password);
  cy.get("input[name='passwordRepeat']").type(user.password);
  cy.get("button[type=submit]").click();

  cy.visit("/login");
  cy.adminLogin(admin.email, admin.password);
  cy.get(".v-card[name=requestCard]").within(() => {
    cy.get("button").click();
  });
  cy.get("[name=requestEmail]")
    .contains(new RegExp("^" + user.email + "$", "g"))
    .should("have.length", 1)
    .parents("[name=request]")
    .within(() => {
      cy.get("button[name=authUser]").click();
    });
  cy.adminLogOut();
})
Cypress.Commands.add("addChair", () => {
  cy.get("button[name=addChair]").click();
});

Cypress.Commands.add("addTable", () => {
  cy.get("button[name=addTable]").click();
});

Cypress.Commands.add("addRoom", (name) => {
  cy.get(".v-toolbar").within(() => {
    cy.get("button[name=createRoom]").click();
  });
  cy.get("input[name=name]").type(name);
  cy.get("button[name=Bestätigen]").click();
  cy.url().should("include", "/room-editor");
});

Cypress.Commands.add("addCourse", (name, subject) => {
  cy.get(".v-toolbar").within(() => {
    cy.get("button[name=createCourse]").click();
  });
  cy.get("input[name=name]").type(name);
  cy.get("input[name=subject]").type(subject);
  cy.get("button[name=Bestätigen]").click();
  cy.url().should("include", "/course-details");
});

Cypress.Commands.add("addStudent", (firstName, lastName) => {
  cy.get(".v-toolbar").within(() => {
    cy.get("button[name=createStudent]").click();
  });
  cy.get("input[name=firstName]").type(firstName);
  cy.get("input[name=lastName]").type(lastName);
  cy.get("button[name=Bestätigen]").click();
});

Cypress.Commands.add(
  "navDropDownTo",
  (destination: "dashboard" | "students" | "courses" | "settings") => {
    cy.get(".v-toolbar").within(() => {
      cy.get(".mdi-menu").parents("button").click();
    });
    switch (destination) {
      case "dashboard":
        cy.get(".v-overlay__content").within(() => {
          cy.get(".v-list-item[name=dashboard]").click();
        });
        cy.url().should("include", "/dashboard");
        break;
      case "students":
        cy.get(".v-overlay__content").within(() => {
          cy.get(".v-list-item[name=viewStudents]").click();
        });
        cy.url().should("include", "/view-students");
        break;
      case "courses":
        cy.get(".v-overlay__content").within(() => {
          cy.get(".v-list-item[name=viewCourses]").click();
        });
        cy.url().should("include", "/view-courses");
        break;
      case "settings":
        cy.get(".v-overlay__content").within(() => {
          cy.get(".v-list-item[name=editAccount]").click();
        });
        cy.url().should("include", "/edit-account");
        break;
    }
  }
);
Cypress.Commands.add(
  "sideMenuTo",
  (
    destination: "dashboard" | "students" | "courses" | "rooms" | "settings"
  ) => {
    switch (destination) {
      case "dashboard":
        cy.get(".v-navigation-drawer").within(() => {
          cy.get(".v-list-item[name=dashboard]").click();
        });
        cy.url().should("include", "/dashboard");
        break;
      case "students":
        cy.get(".v-navigation-drawer").within(() => {
          cy.get(".v-list-item[name=viewStudents]").click();
        });
        cy.url().should("include", "/view-students");
        break;
      case "courses":
        cy.get(".v-navigation-drawer").within(() => {
          cy.get(".v-list-item[name=viewCourses]").click();
        });
        cy.url().should("include", "/view-courses");
        break;
      case "rooms":
        cy.get(".v-navigation-drawer").within(() => {
          cy.get(".v-list-item[name=viewRooms]").click();
        });
        cy.url().should("include", "/view-rooms");
        break;
      case "settings":
        cy.get(".v-navigation-drawer").within(() => {
          cy.get(".v-list-item[name=editAccount]").click();
        });
        cy.url().should("include", "/edit-account");
        break;
    }
  }
);

Cypress.Commands.add("adminLogin", (email, password) => {
  cy.url().should("include", "/login");
  cy.get("input[name='email']").type(email);
  cy.get("input[name='password']").type(password);
  cy.get("button[type=submit]").click();
  cy.url().should("include", "/admin");
  cy.contains("Akzeptierte Accounts");
  cy.contains("Accountanträge");
  cy.contains("Administratorseite");
  cy.contains("Abmelden");
});
Cypress.Commands.add("userLogin", (email, password) => {
  cy.url().should("include", "/login");
  cy.get("input[name='email']").type(email);
  cy.get("input[name='password']").type(password);
  cy.get("button[type=submit]").click();
  cy.url().should("include", "/dashboard");
  cy.contains("Kürzlich verwendete Kurse");
  cy.contains("Letzte Sitzungen");
  cy.contains("Alle anzeigen");
});
Cypress.Commands.add("desktopLogOut", () => {
  cy.get(".v-navigation-drawer").within(()=>{
    cy.get("[name=logOut]").click()
  });
  cy.url().should("include", "/login");
});
Cypress.Commands.add("adminLogOut", () => {
  cy.contains("Abmelden");
  cy.get("button").contains("Abmelden").click();
  cy.url().should("include", "/login");
});

Cypress.Commands.add("mobileLogOut", () => {
});

// Convert this to a module instead of script (allows import/export)
export {};
