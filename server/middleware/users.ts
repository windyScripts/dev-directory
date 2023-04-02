import { ForbiddenError } from 'express-response-errors';
import * as he from 'he';

import { AnyRequestHandler } from 'server/types/express';

export const requireSameId: AnyRequestHandler = async (req, res, next) => {
  if (req.user.id.toString() !== req.params.id) {
    throw new ForbiddenError('User can only make changes to their own profile');
  }

  next();
};

export const sanitize: AnyRequestHandler = async (req, res, next) => {
  const fields = Object.keys(req.body);
  fields.forEach(field => {
    req.body[field] = he.encode(req.body[field], {
      useNamedReferences: true,
    });
  });

  next();
};
