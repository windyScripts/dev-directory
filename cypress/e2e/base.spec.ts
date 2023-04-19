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

describe('Onboarding Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/onboarding');
  });

  it('displays the correct heading', () => {
    cy.contains('h1', 'Onboarding');
  });

  it('fills out the form successfully', () => {
    cy.get('form').within(() => {
      cy.get('textarea[name="bio"]').type('Lorem ipsum dolor sit amet.');
      cy.get('input[name="twitter_username"]').type('test_twitter');
      cy.get('input[name="linkedin_url"]').type('https://www.linkedin.com/in/test_linkedin');
      cy.get('input[name="github_username"]').type('test_github');
      cy.get('input[name="website"]').type('https://www.testwebsite.com');
      cy.visit('http://localhost:3000/directory');
    });

    cy.url().should('equal', 'http://localhost:3000/directory');
  });
});

export {};
