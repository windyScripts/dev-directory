import { RequestHandler } from 'express';
import { NotFoundError } from 'express-response-errors';
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

type ReqUser = Pick<User, 'id'
| 'discord_user_id'
| 'discord_name'
| 'bio'
| 'twitter_username'
| 'linkedin_url'
| 'github_username'
| 'website'>

export const getUserById: RequestHandler<{id: string}, ReqUser> = async (req, res) => {
  // Find the user with the specified ID in the database
  // Can we define an object of type ReqUser here and then reference it?
  const user = await User.findByPk(req.params.id, {
    attributes: [
      'id',
      'discord_user_id',
      'discord_name',
      'bio',
      'twitter_username',
      'linkedin_url',
      'github_username',
      'website',
    ],
  });

  // If user is not found, throw error
  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json(user);
};
