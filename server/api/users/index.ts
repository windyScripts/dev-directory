import { AsyncRouter } from 'express-async-router';

import { getUserById } from './users.controller';

const userRouter = AsyncRouter();

userRouter.get('/:id', getUserById);

export default userRouter;
