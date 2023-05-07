// todo: replace this with the shared user type once merged
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type User = Record<string, any>;

export interface AuthState {
  authedUser: User | null;
}

export type AuthAction = {
  type: 'SET_AUTHED_USER';
  user: AuthState['authedUser'];
};

// A reducer takes old state, some action, and returns the new state
// based on that action
export type AuthReducer = React.Reducer<AuthState, AuthAction>;

// A dispatch is an action that's called to update a state
// in this case, this context
export type AuthDispatch = React.Dispatch<AuthAction>;

