import { AsyncRouter } from 'express-async-router';

import { requireUser } from 'server/middleware/auth';

import { getUserFlags } from './flags.controller';

const flagsRouter = AsyncRouter();

flagsRouter.get('/', requireUser, getUserFlags);

export default flagsRouter;
