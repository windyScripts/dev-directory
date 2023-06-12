import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: './cypress/support/e2e.ts',
    specPattern: './cypress/e2e',
    baseUrl: 'http://localhost:3000',
  },
  fixturesFolder: './cypress/fixtures',
  screenshotsFolder: './cypress/screenshots',
  videosFolder: './cypress/videos',
  downloadsFolder: './cypress/downloads',
  fileServerFolder: './',
});
