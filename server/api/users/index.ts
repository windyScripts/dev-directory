import { AsyncRouter } from 'express-async-router';

import { requireUser } from 'server/middleware/auth';

import { getCurrentUser, getUserById, updateUserById } from './users.controller';


const userRouter = AsyncRouter();

userRouter.get('/', requireUser, getCurrentUser);

userRouter.get('/:id', getUserById);

userRouter.patch('/:id', updateUserById);

export default userRouter;
