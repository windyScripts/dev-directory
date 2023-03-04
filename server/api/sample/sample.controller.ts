import { RequestHandler } from 'express';
import User from 'server/models/User.model';

export const sampleHandler: RequestHandler = async (req, res) => {
  await User.create({
    email: 'blah@blah.com',
    discordUserId: '123',
  })
  res.json({ message: 'This is a test!' });
};
