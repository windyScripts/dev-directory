import { AsyncRouter } from 'express-async-router';

import { requireUser } from 'server/middleware/auth';

import { getCurrentUser } from './users.controller';
const userRouter = AsyncRouter();

userRouter.get('/', requireUser, getCurrentUser);

export default userRouter;
