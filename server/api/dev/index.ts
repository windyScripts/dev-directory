import { AsyncRouter } from 'express-async-router';

import { getCreateUsers, getLogin, getTruncateDatabase, getSeedDatabase } from 'server/api/dev/dev.controller';

const devRouter = AsyncRouter();

devRouter.get('/create-users/:count?', getCreateUsers);
devRouter.get('/login/:id?', getLogin);
devRouter.get('/truncate-database', getTruncateDatabase);
devRouter.get('/seed-database', getSeedDatabase);

export default devRouter;
