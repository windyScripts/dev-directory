import { AsyncRouter } from 'express-async-router';

import { requireUser } from 'server/middleware/auth';

import { createSkipOnboardingFlag, getUserFlags } from './flags.controller';

const flagsRouter = AsyncRouter();

flagsRouter.get('/', requireUser, getUserFlags);
flagsRouter.post('/skip-onboarding', requireUser, createSkipOnboardingFlag);

export default flagsRouter;
