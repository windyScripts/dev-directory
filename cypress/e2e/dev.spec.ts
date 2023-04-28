import '../support/commands';

describe('example test', () => {
  it('allows a guest to login', () => {
    cy.visit('http://localhost:3000');
    cy.get('a').contains('Log in').should('have.length', 1);

    cy.login().reload();
    cy.get('button').contains('Log out').should('have.length', 1);
  });
});

export {};
