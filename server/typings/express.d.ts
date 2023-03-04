import User from 'server/models/User.model';

declare global {
  namespace Express {
    export interface Request {
      // todo: type with user
      user?: User;
    }
  }
}
