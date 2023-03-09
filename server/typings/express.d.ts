import { User } from 'server/models';

declare global {
  namespace Express {
    export interface Request {
      // todo: type with user
      user?: User;
    }
  }
}
