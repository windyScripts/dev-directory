/// <reference types="cypress" />

describe('Onboarding Page', () => {
  after(() => {
    cy.truncateDatabase();
  });

  it('fills out the form successfully', () => {
    cy.login();
    cy.visit('http://localhost:3000/onboarding');
    cy.get('form').within(() => {
      cy.get('textarea[name="bio"]').type('Lorem ipsum dolor sit amet.');
      cy.get('input[name="twitter_username"]').type('test_twitter');
      cy.get('input[name="linkedin_url"]').type('https://www.linkedin.com/in/test_linkedin');
      cy.get('input[name="github_username"]').type('test_github');
      cy.get('input[name="website"]').type('https://www.testwebsite.com');
      cy.get('button[type="submit"]').click();
    });

    cy.url().should('equal', 'http://localhost:3000/directory');
  });
});

export {};
