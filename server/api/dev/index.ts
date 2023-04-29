import { AsyncRouter } from 'express-async-router';

import { getLogin, postRunUtil } from 'server/api/dev/dev.controller';

const devRouter = AsyncRouter();

devRouter.get('/login/:id?', getLogin);
devRouter.post('/run-util', postRunUtil);

export default devRouter;
