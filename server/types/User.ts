import { User } from 'server/models';

export type UserObject = Omit<User, 'id'>;
