import DOMpurify from 'isomorphic-dompurify';

import { AnyRequestHandler } from 'server/types/express';

export const removeMarkup: AnyRequestHandler = async (req, res, next) => {
  const fields = Object.keys(req.body);
  fields.forEach((field) => {
    req.body[field] = DOMpurify.sanitize(req.body[field]);
  });

  next();
};
