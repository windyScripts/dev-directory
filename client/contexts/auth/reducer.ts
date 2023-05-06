import { produce } from "immer";
import { AuthReducer } from "./types";

export const reducer: AuthReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTHED':
      const nextState = produce(state, (draftState) => {
        draftState.authed = action.authed;
      });
      return nextState;
    default:
      return state;
  }
};
