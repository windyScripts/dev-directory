/// <reference types="cypress" />

describe('Open browser and check if login button exists.', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Checks if there is an anchor with the text login', () => {
    cy.get('a').contains('Log in').should('have.length', 1);
  });
});

export {};
