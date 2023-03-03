import { RequestHandler } from 'express';

export const sampleHandler: RequestHandler = (req, res) => {
  res.json({ message: 'This is a test!' });
};
