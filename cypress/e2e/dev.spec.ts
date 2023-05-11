import '../support/commands';

// Example tests demonstrating use of the utility functions.
describe('example login test', () => {
  afterEach(() => {
    cy.truncateDatabase();
  });

  it('allows a user to login and logout', () => {
    cy.visit('http://localhost:3000');
    cy.contains('a', 'Login').should('exist');

    cy.login().reload();
    const logoutBtn = cy.contains('button', 'Logout');
    logoutBtn.should('exist');

    logoutBtn.click();
    cy.contains('a', 'Login').should('exist');
  });
});

describe('example run-util test', () => {
  it('can call other utility functions and access the response', () => {
    cy.runUtil('makeUserObject').then(response => {
      const body = response.body as { discord_name: string };
      expect(body.discord_name).to.exist;
    });
  });
});

// Example test would be too closely tied to the temporary UI
// Left here for reference, but should remain commented.
//
// describe('example create users/truncate test', () => {
//   it('can create users and truncate the database afterwards', () => {
//     cy.truncateDatabase();
//     cy.visit('http://localhost:3000/directory');
//     cy.get('ul li').should('have.length', 0);
//
//     cy.createUsers(20);
//     cy.visit('http://localhost:3000/directory');
//     cy.get('ul li').should('have.length', 20);
//
//     cy.truncateDatabase();
//     cy.visit('http://localhost:3000/directory');
//     cy.get('ul li').should('have.length', 0);
//   });
// });

export {};
