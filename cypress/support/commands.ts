/// <reference types="cypress" />

// https://on.cypress.io/custom-commands
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      createUsers(count?: number): Chainable<void>;
      login(id?: number): Chainable<void>;
      truncateDatabase(): Chainable<void>;
      seedDatabase(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('createUsers', (count?: number) => {
  const countStr = count !== undefined ? `/${count}` : '';
  cy.request('GET', `http://localhost:3000/api/dev/create-users${countStr}`);
});

Cypress.Commands.add('login', (id?: number) => {
  const idStr = id !== undefined ? `/${id}` : '';
  cy.request('GET', `http://localhost:3000/api/dev/login${idStr}`);
});

Cypress.Commands.add('truncateDatabase', () => {
  cy.request('GET', 'http://localhost:3000/api/dev/truncate-database');
});

Cypress.Commands.add('seedDatabase', () => {
  cy.request('GET', 'http://localhost:3000/api/dev/seed-database');
});

export = {};
