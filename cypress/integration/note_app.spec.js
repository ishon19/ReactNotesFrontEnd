describe("Note App", () => {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      name: "Shashwat Pathak",
      username: "shashwat",
      password: "myPassword",
    };
    cy.request("POST", "http://localhost:3001/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("front page can be opened", () => {
    cy.contains("Notes");
    cy.contains("Note App.. Courtesy of University of Helsinki 2020");
  });

  it("login form can be opened", function () {
    cy.contains("Login").click();
    cy.get("#username").type("shashwat");
    cy.get("#password").type("myPassword");
    cy.get("#login-button").click();
    cy.contains("Shashwat Pathak Logged In");
  });

  it("login fails with wrong password", function () {
    cy.contains("Login").click();
    cy.get("#username").type("shashwat");
    cy.get("#password").type("wrongPassword");
    cy.get("#login-button").click();
    cy.get(".error")
      .should("contain", "Wrong Credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");
    cy.get("html").should("not.contain", "Shashwat Pathak Logged In");
  });

  describe("when logged in", function () {
    beforeEach(function () {
      /* cy.contains("Login").click();
      cy.get("input:first").type("shashwat");
      cy.get("input:last").type("myPassword");
      cy.get("#login-button").click(); */
      cy.login({ username: "shashwat", password: "myPassword" });
    });

    it("a new note can be created", function () {
      cy.get("#new-note-button").click();
      cy.get("#newNote").type("a new note created by cypress");
      cy.contains("Save Note").click();
      cy.contains("a new note created by cypress");
    });

    describe("and a note exists", function () {
      beforeEach(function () {
        /* cy.get("#new-note-button").click();
        cy.get("#newNote").type("another note cypress");
        cy.contains("Save Note").click(); */
        cy.createNote({
          content: "another note by cypress",
          important: false,
        });
      });

      it("it can be made important", function () {
        cy.contains("another note by cypress")
          .contains("Make Important")
          .click();
        cy.contains("another note by cypress").contains("Make not important");
      });
    });

    describe("and several notes exist", function () {
      beforeEach(function () {
        cy.createNote({ content: "First Note", important: false });
        cy.createNote({ content: "Second Note", important: false });
        cy.createNote({ content: "Third Note", important: false });
      });
      it("one of those can be made important", function () {
        cy.contains("Second Note").contains("Make Important").click();
        cy.contains("Second Note").contains("Make not important");
      });
    });
  });
});
