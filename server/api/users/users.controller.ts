import { RequestHandler } from 'express';
import _ from 'lodash';

import { User } from 'server/models';

type ClientUser = Pick<User, 'id' | 'discord_user_id'>

export const getCurrentUser: RequestHandler<void, ClientUser>  = (req, res) => {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const filteredUser = _.pick(req.user!, [
    'id',
    'discord_user_id',
    'discord_name',
  ]);

  res.json(filteredUser);
};
