/// <reference types="cypress" />

describe('Open browser and check if login button exists.', () => {

  beforeEach(() => {
  cy.visit('http://localhost:3000');
})

it('Checks if there is an h1',() => {
  cy.get('a').contains('Log in').should('have.length',1)
})


})

// href="https://discord.com/oauth2/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth-redirect&amp;response_type=code&amp;scope=identify+email+guilds&amp;client_id=1082239786162606080"
// <a class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-sghohy-MuiButtonBase-root-MuiButton-root" tabindex="0" href="https://discord.com/oauth2/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth-redirect&amp;response_type=code&amp;scope=identify+email+guilds&amp;client_id=1082239786162606080" contextmenu="fcltHTML5Menu1">Log in<span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span></a>