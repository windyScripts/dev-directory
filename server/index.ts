import 'dotenv-flow/config';
import log from './lib/log';
import Server from './server';

// this code runs the express server
async function run() {
  try {
    const server = new Server();
    await server.init();
    await server.start();
  } catch (err) {
    log('failed to start', err)
    throw err
  }
}

run();
