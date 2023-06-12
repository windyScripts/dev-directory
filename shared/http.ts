import { UserProfile } from 'shared/User';

import { FlagName } from './Flag';

export type CurrentUserResponse = {
  user: UserProfile | null;
  flags: FlagName[];
};
