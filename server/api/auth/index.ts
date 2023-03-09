import { AsyncRouter } from 'express-async-router';

import { login } from './auth.controller';
const authRouter = AsyncRouter();

authRouter.post('/login', login);

export default authRouter;
