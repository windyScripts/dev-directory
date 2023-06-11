import { AsyncRouter } from 'express-async-router';

import { getCurrentUser, login, logout } from './auth.controller';

const authRouter = AsyncRouter();

authRouter.get('/current-user', getCurrentUser);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;
