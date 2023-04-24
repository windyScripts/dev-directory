import { AsyncRouter } from 'express-async-router';

import { requireUser } from 'server/middleware/auth';
import { requireSameId, sanitize } from 'server/middleware/users';

import flagsRouter from '../flags';

import { getUserById, getUsers, updateUserById } from './users.controller';

const userRouter = AsyncRouter();

userRouter.get('/:id', getUserById);

userRouter.get('/', getUsers);

userRouter.patch('/:id', requireUser, requireSameId, sanitize, updateUserById);

userRouter.use('/:id/flags', flagsRouter);

export default userRouter;
