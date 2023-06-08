/// <reference types="cypress" />
import '../support/commands';

describe('Edit profile functions correctly', () => {
  before(() => {
    cy.createUsers(10);
  });

  beforeEach(() => {
    cy.login(1).reload();
    cy.createUsers(10);
  });

  it('Prevents a user from editing other users profiles', () => {
    cy.visit('http://localhost:3000/profile/2');
    cy.get('[data-cy="edit-button"]').should('not.exist');
  });

  it('Allows a user the ability to edit their profile', () => {
    cy.visit('http://localhost:3000/profile/1');
    cy.get('[data-cy="edit-button"]').should('exist');
  });

  it('Editing profile works and updates the webpage', () => {
    cy.visit('http://localhost:3000/profile/1');
    cy.get('[data-cy="edit-button"]').click();
    cy.get('[data-cy="bio-input"]').clear().type('Tim prefers water with cereal');
    cy.get('[data-cy="update-button"]').click();
    cy.contains('p', 'Tim prefers water with cereal').should('exist');
  });
});

export {};
