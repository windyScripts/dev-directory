/// <reference types="cypress" />
// import User from 'server/models/User.model';
import { executeCypressCommand } from '../support/e2e';
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

describe('directory infinite scroll', () => {
  const PAGE_LIMIT = 20;
  let totalPages = 0;
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

  it('first 20 users load ', () => {
    cy.get('[data-cy="user-container"]').children().should('have.length', 20);
  });

  it('Should show the loading spinner when loading the data then remove it afterwards', () => {
    cy.scrollTo('bottom');
    cy.intercept('GET', '/api/users?page=*', req => {
      req.on('response', res => res.setDelay(500));
    }).as('getUsers');

    cy.get('[data-cy="loading"]'); //check if exists
    cy.wait('@getUsers');
    cy.get('[data-cy="loading"]').should('not.exist'); // removed after data loaded
  });

  it('data loads when scrolled multiple times', () => {
    checkInfiniteScroll(5, totalPages);
  });

  it('User is unable to Infinite scroll more than total pages', () => {
    checkInfiniteScroll(totalPages + 1, totalPages);
  });
});

export {};
