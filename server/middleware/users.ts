import { ForbiddenError } from 'express-response-errors';
import DOMpurify from 'isomorphic-dompurify';

import { AnyRequestHandler } from 'server/types/express';

export const requireSameId: AnyRequestHandler = async (req, res, next) => {
  if (req.user.dataValues.id.toString() !== req.params.id) {
    throw new ForbiddenError('User can only make changes to their own profile');
  }

  next();
};

export const removeMarkup: AnyRequestHandler = async (req, res, next) => {
  const fields = Object.keys(req.body);
  fields.forEach((field) => {
    req.body[field] = DOMpurify.sanitize(req.body[field]);
  });

  next();
};
