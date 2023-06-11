import { UserProfile } from 'shared/User';

import { FlagName } from './Flag';

export type CurrentUserResponse = {
  user: UserProfile;
  flags: FlagName[];
} | {
  user: null;
};
