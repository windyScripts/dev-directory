import { produce } from 'immer';

import { AuthReducer } from './types';

export const reducer: AuthReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTHED':
      return produce(state, draftState => {
        draftState.authed = action.authed;
      });
    default:
      return state;
  }
};
