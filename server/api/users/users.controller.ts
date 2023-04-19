import { RequestHandler } from 'express';
import { BadRequestError, NotFoundError } from 'express-response-errors';
import _ from 'lodash';

import { User, Flag } from 'server/models';
import { UserProfile } from 'server/types/User';

type ClientUser = Pick<User, 'id' | 'discord_user_id'>;

const USERS_LIMIT = 20;

const getCurrentUser: RequestHandler<void, ClientUser> = (req, res) => {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const filteredUser = _.pick(req.user!, [
    'id',
    'discord_user_id',
    'discord_name',
  ]);

  res.json(filteredUser);
};

const getUserById: RequestHandler<{ id: string }, UserProfile> = async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: User.allowedFields });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json(user);
};

const getUsers: RequestHandler = async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const offset = (page - 1) * USERS_LIMIT;

  if (!Number.isInteger(page) || page < 1) {
    throw new BadRequestError('Invalid page number');
  }

  const { rows: users, count } = await User.findAndCountAll({
    attributes: User.allowedFields,
    limit: USERS_LIMIT,
    offset,
    order: [
      ['id', 'ASC'],
    ],
  });

  const totalPages = Math.ceil(count / USERS_LIMIT) || 1;

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

interface FlagAttributes {
  id: number;
  user_id: number;
  flag_name: string;
}

const createFlag: RequestHandler = async (req, res) => {
  try {
    const flag = await Flag.create({
      user_id: req.user.id,
      flag_name: req.body.flag_name,
    });
    res.status(201).json({ flag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create flag' });
  }
};

const getUserFlags: RequestHandler = async (req, res) => {
  const flags = await Flag.findAll({ where: { user_id: req.user.id }});

  const flagNames = flags.map((flag: FlagAttributes) => flag.flag_name);

  return res.json({ flags: flagNames });
};

export {
  USERS_LIMIT,
  getCurrentUser,
  getUserById,
  getUsers,
  updateUserById,
  createFlag,
  getUserFlags,
};
