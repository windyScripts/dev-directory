import { AsyncRouter } from 'express-async-router';

import { requireUser } from 'server/middleware/auth';
import { requireSameId, sanitize } from 'server/middleware/users';

import { getUserById, getUsers, updateUserById, createFlag, getUserFlags } from './users.controller';

const userRouter = AsyncRouter();

userRouter.get('/:id', getUserById);

userRouter.get('/', getUsers);

userRouter.patch('/:id', requireUser, requireSameId, sanitize, updateUserById);

userRouter.get('/:id/flags', requireUser, requireSameId, getUserFlags);

userRouter.post('/:id/flags', requireUser, requireSameId, createFlag);

export default userRouter;
