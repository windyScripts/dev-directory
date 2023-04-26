import { RequestHandler } from 'express';

import { Flag } from 'server/models';

const createSkipOnboardingFlag: RequestHandler = async (req, res) => {
  try {
    const flag = await Flag.create({
      user_id: req.user.id,
      name: 'onboarding_skipped',
    });
    res.status(201).json({ flag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create flag' });
  }
};

const getUserFlags: RequestHandler = async (req, res) => {
  const flags = await Flag.findAll({ where: { user_id: req.user.id }});

  const flagNames = flags.map(flag => flag.name);

  res.json({ flags: flagNames });
};

export {
  getUserFlags,
  createSkipOnboardingFlag,
};
