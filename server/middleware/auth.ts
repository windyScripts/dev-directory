import { UnauthorizedError } from 'express-response-errors';
import jwt from 'jsonwebtoken';

import { validateToken } from 'server/lib/auth';
import { User } from 'server/models';
import { AnyRequestHandler } from 'server/types/express';
import { AUTH_COOKIE_NAME } from 'shared/constants';

export const attachUser: AnyRequestHandler = async (req, res, next) => {
  const token = req.cookies[AUTH_COOKIE_NAME];
  if (validateToken(token)) {
    const payload = jwt.decode(token) as jwt.JwtPayload;
    if (payload.user_id) {
      const user = await User.findByPk(payload.user_id);
      req.user = user;
    }
  }

  next();
};

export const requireUser: AnyRequestHandler = async (req, res, next) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }

  next();
};
