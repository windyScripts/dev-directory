import NextApp, { AppContext, AppProps } from 'next/app';
import React from 'react';
import 'client/styles/globals.css';

import Layout from 'client/components/layout/Layout';
import { AuthContextProvider } from 'client/contexts/auth';
import { AuthState } from 'client/contexts/auth/types';
import createAxiosInstance from 'client/lib/axios';
import { CurrentUserResponse } from 'shared/http';

interface Props extends AppProps {
  currentUser: CurrentUserResponse;
}

const App = ({ Component, pageProps, currentUser }: Props) => {
  const initialState: AuthState = {
    authedUser: currentUser.user,
    flags: currentUser.flags,
  };

  return (
    <AuthContextProvider initialState={initialState}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  );
};

App.getInitialProps = async (context: AppContext) => {
  const ctx = await NextApp.getInitialProps(context);

  const req = context.ctx.req;

  let currentUser: CurrentUserResponse = {
    user: null,
    flags: [],
  };
  try {
    const axios = createAxiosInstance(req);
    const response = await axios.get('/api/auth/current-user');
    currentUser = response.data || null;
  } catch (err) {
    // TODO: handle this in the client if it errors
    console.error(err);
  }

  return { ...ctx, currentUser };
};

export default App;
