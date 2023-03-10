import { RequestHandler } from 'express';
import { UnauthorizedError } from 'express-response-errors';
import jwt from 'jsonwebtoken';

import { validateToken } from 'server/lib/auth';
import { User } from 'server/models';
import { AUTH_COOKIE_NAME } from 'shared/constants';


export const attachUser: RequestHandler = async (req, res, next) => {
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

export const requireUser: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    throw new UnauthorizedError();
  }

  next();
};