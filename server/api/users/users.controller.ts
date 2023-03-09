import { RequestHandler } from "express";
import _ from "lodash";
import { User } from "server/models";

type ClientUser = Pick<User, 'id' | 'discord_user_id'>

export const getCurrentUser: RequestHandler<void, ClientUser>  = (req, res) => {
  const filteredUser = _.pick(req.user!, [
    'id',
    'discord_user_id',
  ])

  res.json(filteredUser)
}
