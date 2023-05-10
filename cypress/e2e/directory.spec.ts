/// <reference types="cypress" />
import { executeCypressCommand } from '../support/e2e';

describe('Visit directory page and verify users exists', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/directory');
  });

  it('Displays a list of users', () => {
    cy.get('ul').should('be.visible');
  });
});

describe('directory infinite scroll', () => {
  const PAGE_LIMIT = 20;
  let totalPages = 0;

  before(() => {
    const commandReset = 'npm run resetDB';
    executeCypressCommand(commandReset);

    // fill DB with 100 users
    const command = 'npm run seed';
    executeCypressCommand(command);

    // get total pages for tests
    cy.request('http://localhost:3000/api/users').then(response => {
      totalPages = response.body.totalPages;
    });
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/directory');
  });

  function checkInfiniteScroll(pages: number, totalPages: number) {
    for (let i = 1; i <= pages; i++) {
      cy.get('[data-cy="user-container"]').children().as('ulChildren');
      i < totalPages
        ? cy.get('@ulChildren').should('have.length', PAGE_LIMIT * i)
        : // last page not guaranteed to be full
          cy.get('@ulChildren').should('have.length.within', PAGE_LIMIT * (i - 1), PAGE_LIMIT * i);

      cy.intercept('GET', '/api/users?page=*', req => {
        req.on('response', res => res.setDelay(500));
      }).as('getUsers');
      cy.scrollTo('bottom');

      // last page won't have a spinner
      if (i === totalPages) break;
      // check spinner happened & removed
      cy.get('[data-cy="loading"]'); //check if exists
      cy.get('[data-cy="loading"]').should('not.exist'); // removed after data loaded
    }
  }

  it('shows the initial 20 users on page load ', () => {
    cy.get('[data-cy="user-container"]').children().should('have.length', 20);
  });

  it('shows a loading animation while fetching users', () => {
    cy.scrollTo('bottom');
    cy.intercept('GET', '/api/users?page=*', req => {
      req.on('response', res => res.setDelay(500));
    }).as('getUsers');

    cy.get('[data-cy="loading"]'); //check if exists
    cy.wait('@getUsers');
    cy.get('[data-cy="loading"]').should('not.exist'); // removed after data loaded
  });

  it('shows users when scrolled multiple times', () => {
    checkInfiniteScroll(5, totalPages);
  });

  it("doesn't attempt to fetch more pages when page limit reached", () => {
    checkInfiniteScroll(totalPages + 1, totalPages);
  });
});

export {};
