import { AsyncRouter } from 'express-async-router';

import { requireUser } from 'server/middleware/auth';
import { requireSameId } from 'server/middleware/users';

import { getUserFlags, createFlag } from './flags.controller';

const flagsRouter = AsyncRouter();

flagsRouter.get('/', requireUser, requireSameId, getUserFlags);
flagsRouter.post('/', requireUser, requireSameId, createFlag);

export default flagsRouter;
