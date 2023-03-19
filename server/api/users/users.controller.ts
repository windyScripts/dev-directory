import { RequestHandler } from 'express';
import { NotFoundError } from 'express-response-errors';
import _ from 'lodash';

import { User } from 'server/models';

type ClientUser = Pick<User, 'id' | 'discord_user_id'>

export const getCurrentUser: RequestHandler<void, ClientUser> = (req, res) => {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const filteredUser = _.pick(req.user!, [
    'id',
    'discord_user_id',
    'discord_name',
  ]);

  res.json(filteredUser);
};

type UserProfile = Pick<User, 'id'
  | 'discord_user_id'
  | 'discord_name'
  | 'bio'
  | 'twitter_username'
  | 'linkedin_url'
  | 'github_username'
  | 'website'>

interface UpdatableFields {
  bio?: string;
  twitter_username?: string;
  linkedin_url?: string;
  github_username?: string;
  webiste?: string;
}

export const getUserById: RequestHandler<{ id: string }, UserProfile> = async (req, res) => {
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

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json(user);
};

export const updateUserById: RequestHandler<{ id: string }, string, UpdatableFields> = async (req, res) => {

  const acceptableFields = [
    'bio',
    'twitter_username',
    'linkedin_url',
    'github_username',
    'website',
  ];

  const toUpdate: UpdatableFields = {};

  acceptableFields.forEach((field) => {
    if (field in req.body) {
      toUpdate[field as keyof UpdatableFields] = req.body[field as keyof UpdatableFields];
    }
  });

  const updated = await User.update(toUpdate, {
    where: {
      id: req.params.id,
    },
  });

  if (updated[0] === 0) {
    throw new NotFoundError('User not found');
  }

  res.json(`User of id ${req.params.id} updated.`);
};
