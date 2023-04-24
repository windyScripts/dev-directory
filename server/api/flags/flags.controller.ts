import { RequestHandler } from 'express';

import { Flag } from 'server/models';

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
  createFlag,
  getUserFlags,
};
