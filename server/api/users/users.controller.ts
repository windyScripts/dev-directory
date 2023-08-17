import { RequestHandler } from 'express';
import { BadRequestError, NotFoundError } from 'express-response-errors';
import _ from 'lodash';

import { Flag, User } from 'server/models';
import { FlagName } from 'shared/Flag';
import { UserProfile, USER_PAGE_SIZE } from 'shared/User';

const getUserById: RequestHandler<{ id: string }, UserProfile> = async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: User.allowedFields });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json(user);
};

const getUsers: RequestHandler = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const offset = (page - 1) * USER_PAGE_SIZE;

  if (!Number.isInteger(page) || page < 1) {
    throw new BadRequestError('Invalid page number');
  }

  const { rows: users, count } = await User.findAndCountAll({
    attributes: User.allowedFields,
    limit: USER_PAGE_SIZE,
    offset,
    order: [
      ['id', 'ASC'],
    ],
  });

  const totalPages = Math.ceil(count / USER_PAGE_SIZE) || 1;

  if (offset >= count && page !== 1) {
    throw new BadRequestError('Page out of range');
  }

  res.json({ page, totalPages, users });
};

interface UpdatableFields {
  bio?: string;
  twitter_username?: string;
  linkedin_url?: string;
  github_username?: string;
  website?: string;
}

const updateUserById: RequestHandler<{ id: string }, string, UpdatableFields> = async (req, res) => {
  const fieldsToUpdate = [
    'bio',
    'twitter_username',
    'linkedin_url',
    'github_username',
    'website',
    'discord_avatar',
  ];

  const toUpdate = _.pick(req.body, fieldsToUpdate);

  if (Object.keys(toUpdate).length === 0) {
    throw new BadRequestError('Request body should contain at least one updatable field.');
  }

  const updated = await User.update(toUpdate, {
    where: {
      id: req.params.id,
    },
  });

  if (updated[0] === 0) {
    throw new NotFoundError('User not found');
  }

  res.sendStatus(200);
};

const skipOnboarding: RequestHandler = async (req, res) => {
  await Flag.upsert({
    user_id: req.user.id,
    name: FlagName.SKIPPED_ONBOARDING,
  });

  res.send();
};

export {
  getUserById,
  getUsers,
  updateUserById,
  skipOnboarding,
};
