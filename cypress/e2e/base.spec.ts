/// <reference types="cypress" />
describe('Open browser and check if login button exists.', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Checks if there is an anchor with the text login', () => {
    cy.get('a').contains('Log in').should('have.length', 1);
  });
});

describe('Visit directory page and verify users exists', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/directory');
  });

  it('Displays a list of users', () => {
    cy.get('ul').should('be.visible');
  });
});

export {};
