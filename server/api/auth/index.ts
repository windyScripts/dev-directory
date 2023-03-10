import { AsyncRouter } from 'express-async-router';

import { login, logout } from './auth.controller';
const authRouter = AsyncRouter();

authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;
