import { RequestHandler } from 'express';

import { Flag } from 'server/models';

const getUserFlags: RequestHandler = async (req, res) => {
  const flags = await Flag.findAll({ where: { user_id: req.user.id }});

  const flagNames = flags.map(flag => flag.name);

  return res.json({ flags: flagNames });
};

export {
  getUserFlags,
};
