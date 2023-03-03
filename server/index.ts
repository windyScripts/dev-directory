import 'dotenv-flow/config';
import Server from './server';

// this code runs the express server
async function run() {
  const server = new Server();
  await server.init();
  await server.start();
}

run();
