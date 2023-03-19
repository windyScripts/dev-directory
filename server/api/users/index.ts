import { AsyncRouter } from 'express-async-router';

import { requireUser } from 'server/middleware/auth';
import { requireSameId, removeMarkup } from 'server/middleware/users';

import { getCurrentUser, getUserById, updateUserById } from './users.controller';


const userRouter = AsyncRouter();

userRouter.get('/', requireUser, getCurrentUser);

userRouter.get('/:id', getUserById);

userRouter.patch('/:id', requireUser, requireSameId, removeMarkup, updateUserById);

export default userRouter;
