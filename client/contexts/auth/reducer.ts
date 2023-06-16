import { produce } from 'immer';

import { AuthReducer } from './types';

export const reducer: AuthReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTHED_USER':
      return produce(state, draftState => {
        draftState.authedUser = action.user;
      });

    case 'SET_FLAGS':
      return produce(state, draftState => {
        draftState.flags = action.flags;
      });

    default:
      return state;
  }
};
