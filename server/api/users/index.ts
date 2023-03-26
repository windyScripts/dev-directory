import { AsyncRouter } from 'express-async-router';

import { getUsers, getUserById } from './users.controller';

const userRouter = AsyncRouter();

userRouter.get('/:id', getUserById);

userRouter.get('/', getUsers);

export default userRouter;
