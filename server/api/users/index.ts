import { AsyncRouter } from 'express-async-router';

import { requireUser } from 'server/middleware/auth';
import { requireSameId, sanitize } from 'server/middleware/users';

import { getUserById, getUsers, skipOnboarding, updateUserById } from './users.controller';

const userRouter = AsyncRouter();

userRouter.get('/:id', getUserById);
userRouter.get('/', getUsers);
userRouter.patch('/:id', requireUser, requireSameId, sanitize, updateUserById);
userRouter.put('/onboarding/skip', requireUser, skipOnboarding);

export default userRouter;
