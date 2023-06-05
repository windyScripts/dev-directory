/// <reference types="cypress" />
import '../support/commands';

describe('Edit profile functions correctly', () => {
  before(() => {
    cy.truncateDatabase();
    cy.createUsers(10);
  });

  beforeEach(() => {
    cy.login(1).reload();
  });

  it('Prevents a user from editing other users profiles', () => {
    cy.visit('http://localhost:3000/profile/2');
    cy.contains('button', 'Edit Profile').should('not.exist');
  });

  it('Allows a user the ability to edit their profile', () => {
    cy.visit('http://localhost:3000/profile/1');
    cy.contains('button', 'Edit Profile').should('exist');
  });

  it('Editing profile works and updates the webpage', () => {
    cy.visit('http://localhost:3000/profile/1');
    cy.contains('button', 'Edit Profile').click();
    cy.get('textarea[name=bio]').clear().type('Tim prefers water with cereal');
    cy.contains('button', 'Update').click();
    cy.contains('p', 'Tim prefers water with cereal').should('exist');
  });
});

export {};
