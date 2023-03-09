import { RequestHandler } from "express";
import _ from "lodash";

export const getCurrentUser: RequestHandler = (req, res) => {
  const filteredUser = _.pick(req.user!, [
    'id',
    'discord_user_id',
  ])

  res.json(filteredUser)
}
