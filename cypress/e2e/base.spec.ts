/// <reference types="cypress" />

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
    // get total pages for tests
    cy.request('http://localhost:3000/api/users').then(response => {
      totalPages = response.body.totalPages;
    });

    // clear the db then fill with 100 users
    // User.destroy({ truncate: true })
    //   .then(() => {
    //     runSeedCommand();
    //   })
    //   .catch(err => {
    //     console.error('Error deleting existing users:', err);
    //   });

    // https://github.com/cypress-io/cypress/issues/789#issuecomment-904295222
    // fill DB with 100 users
    const command = 'npm run seed';

    if (Cypress.platform !== 'win32') {
      cy.exec(command);
    } else {
      // This is a workaround against cy.exec not working on windows machine
      // https://github.com/cypress-io/cypress/issues/789
      // To make this code work you need to setup 2 cypress env variables in cypress.config.ts
      // - bash (pointing to the bash shell executable on your machine)
      // - comSpec (pointing to cmd.exe on your machine)
      const sh = `"${Cypress.env('bash')}" --login -c`;
      const fullCommand = `${sh} "${command}"`;
      // const sh = `"${Cypress.env('bash')}" --login -i -c`;
      cy.exec(fullCommand, { env: { SHELL: Cypress.env('comSpec') } })
        .its('code')
        .should('eq', 0);
    }

    // runSeedCommand();
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
