import '../support/commands';

describe('example test', () => {
  it('allows a user to login and logout', () => {
    cy.visit('http://localhost:3000');
    cy.contains('a', 'Log in').should('exist');

    cy.login().reload();
    const logoutBtn = cy.contains('button', 'Log out');
    logoutBtn.should('exist');

    logoutBtn.click();
    cy.contains('a', 'Log in').should('exist');
  });
});

export {};
