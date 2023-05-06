
export interface AuthState {
  authed: boolean;
}

export type AuthAction = {
  type: 'SET_AUTHED';
  authed: boolean;
};

// A reducer takes old state, some action, and returns the new state
// based on that action
export type AuthReducer = React.Reducer<AuthState, AuthAction>;

// A dispatch is an action that's called to update a state
// in this case, this context
export type AuthDispatch = React.Dispatch<AuthAction>;

