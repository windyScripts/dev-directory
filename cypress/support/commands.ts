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
      createUsers(count?: number): Chainable<Response<unknown>>;
      login(id?: number): Chainable<Response<unknown>>;
      truncateDatabase(): Chainable<Response<unknown>>;
      runUtil(method: string, ...args: unknown[]): Chainable<Response<unknown>>;
    }
  }
}

Cypress.Commands.add('createUsers', (count?: number) => {
  return cy.runUtil('createUsers', count);
});

Cypress.Commands.add('login', (id?: number) => {
  const idStr = id !== undefined ? `/${id}` : '';
  return cy.request('GET', `http://localhost:3000/api/dev/login${idStr}`);
});

Cypress.Commands.add('truncateDatabase', () => {
  return cy.runUtil('truncateDatabase');
});

Cypress.Commands.add('runUtil', (method, ...args) => {
  return cy.request('POST', 'http://localhost:3000/api/dev/run-util', { method, args });
});

export = {};
