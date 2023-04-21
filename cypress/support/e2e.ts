// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

export function executeCypressCommand(command: string) {
  // https://github.com/cypress-io/cypress/issues/789#issuecomment-904295222
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

    const logResults = result => {
      if (result.stdout.toString().length > 0) {
        cy.log('Stdout: ' + result.stdout.toString());
      }
      if (result.stderr.toString().length > 0) {
        cy.log('Stderr: ' + result.stderr.toString());
      }
    };
    //for some reason cypress cannot find shell on the first try so it throws
    //this is a retry hack allowing cypress to gracefully deal with error
    let tryAgain = false;
    const execOptions = {
      env: { SHELL: Cypress.env('comSpec') },
      failOnNonZeroExit: false,
    };

    cy.exec(fullCommand, execOptions).then(result => {
      logResults(result);
      // attempt again
      if (result.code === 1) {
        tryAgain = true;
      }
    });

    if (tryAgain) {
      cy.exec(fullCommand, execOptions).then(result => logResults(result));
    }
  }
}

// Alternatively you can use CommonJS syntax:
// require('./commands')
