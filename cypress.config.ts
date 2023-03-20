import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: './client/tests/cypress/support/e2e.ts',
    specPattern:'./client/tests/cypress/e2e',
  },
  fixturesFolder: './client/tests/cypress/fixtures',
  screenshotsFolder: './client/tests/cypress/screenshots',
  videosFolder: './client/tests/cypress/videos',
  downloadsFolder: './client/tests/cypress/downloads',
  fileServerFolder:'./',
});
