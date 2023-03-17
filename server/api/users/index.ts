import { AsyncRouter } from 'express-async-router';

import { requireUser } from 'server/middleware/auth';

import { getCurrentUser , getUserById } from './users.controller';


const userRouter = AsyncRouter();

userRouter.get('/', requireUser, getCurrentUser);

userRouter.get('/:id', getUserById);

export default userRouter;
