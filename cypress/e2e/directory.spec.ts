/// <reference types="cypress" />
import '../support/commands';

describe('directory infinite scroll', () => {
  const PAGE_LIMIT = 20;
  let totalPages = 0;

  before(() => {
    cy.truncateDatabase();

    cy.createUsers(100);

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

      if (i < totalPages) {
        cy.get('@ulChildren').should('have.length', PAGE_LIMIT * i);
      } else {
        // last page not guaranteed to be full
        cy.get('@ulChildren').should('have.length.within', PAGE_LIMIT * (i - 1), PAGE_LIMIT * i);
      }

      cy.intercept('/api/users?page=*', req => {
        req.alias = 'getUsers';
      }).as('getUsers');

      cy.scrollTo('bottom');
      // last page won't have a spinner
      if (i === totalPages) break;

      // spinner should exist & be removed after request completes
      cy.get('[data-cy="loading"]');
      cy.wait('@getUsers');
      cy.get('[data-cy="loading"]').should('not.exist');
    }
  }

  it('shows the initial 20 users on page load ', () => {
    cy.get('[data-cy="user-container"]').children().should('have.length', 20);
  });

  it('shows a loading animation while fetching users', () => {
    cy.scrollTo('bottom');
    cy.intercept('/api/users?page=*', req => {
      req.alias = 'getUsers';
    }).as('getUsers');

    // spinner should exist & be removed after request completes
    cy.get('[data-cy="loading"]');
    cy.wait('@getUsers');
    cy.get('[data-cy="loading"]').should('not.exist');
  });

  it('shows users when scrolled multiple times', () => {
    checkInfiniteScroll(5, totalPages);
  });

  it("doesn't attempt to fetch more pages when page limit reached", () => {
    checkInfiniteScroll(totalPages + 1, totalPages);
  });

  it('shows Error Popup when the server returns a 400 Status', () => {
    cy.intercept('GET', '/api/users?page=2', req => {
      req.reply({
        statusCode: 400,
        body: {
          code: 'ERR_BAD_REQUEST',
          message: 'Request failed with status code 400',
        },
      });
      // req.on('before:response', res => (res.statusCode = 400));
    }).as('getUsers');
    cy.scrollTo('bottom');

    cy.get('[data-cy="errorpopup"]');
  });
});

export {};
