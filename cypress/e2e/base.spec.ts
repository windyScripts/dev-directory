/// <reference types="cypress" />
describe('Open browser and check if login button exists.', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Checks if there is an anchor with the text login', () => {
    cy.get('a').contains('Login').should('have.length', 1);
  });
});

export {};
