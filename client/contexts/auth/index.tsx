import React from 'react';

import { reducer } from './reducer';
import { AuthDispatch, AuthReducer, AuthState } from './types';

const defaultState: AuthState = {
  authed: false,
};

const AuthStateContext = React.createContext<AuthState>(defaultState);
const AuthDispatchContext = React.createContext<AuthDispatch>({} as AuthDispatch);

interface Props {
  children: React.ReactNode;
  initialState: Partial<AuthState>;
}

export const AuthContextProvider: React.FC<Props> = ({ children, initialState }) => {
  const combinedState: AuthState = {
    ...defaultState,
    ...initialState,
  };
  const [state, dispatch] = React.useReducer<AuthReducer>(reducer, combinedState);

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => React.useContext(AuthStateContext);
export const useAuthDispatch = () => React.useContext(AuthDispatchContext);
