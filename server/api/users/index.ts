import { AsyncRouter } from 'express-async-router';

<<<<<<< HEAD
import { getUsers, getUserById } from './users.controller';
=======
import { getUserById } from './users.controller';
>>>>>>> 4d31cbc (#33 Remove endpoint for getting a user's profile (#64))

const userRouter = AsyncRouter();

userRouter.get('/:id', getUserById);

userRouter.get('/', getUsers);

export default userRouter;
