/// <reference types="cypress" />

describe('Onboarding Page', () => {
  it('fills out the form successfully', () => {
    cy.login();
    cy.visit('/onboarding');
    cy.get('form').within(() => {
      cy.get('textarea[name="bio"]').clear().type('Lorem ipsum dolor sit amet.');
      cy.get('input[name="twitter_username"]').clear().type('test_twitter');
      cy.get('input[name="linkedin_url"]').clear().type('https://www.linkedin.com/in/test_linkedin');
      cy.get('input[name="github_username"]').clear().type('test_github');
      cy.get('input[name="website"]').clear().type('https://www.testwebsite.com');
      cy.get('button[type="submit"]').click();
      cy.wait(5000);
    });

    cy.url().should('contain', '/directory');
  });
});

export {};
