import jwt from 'jsonwebtoken';
import NextApp, { AppContext, AppProps } from 'next/app';
import React from 'react';
import Cookies from 'universal-cookie';
import 'client/styles/globals.css';

import Layout from 'client/components/layout/Layout';
import { AuthContextProvider } from 'client/contexts/auth';
import { User } from 'client/contexts/auth/types';
import createAxiosInstance from 'client/lib/axios';
import { AUTH_COOKIE_NAME } from 'shared/constants';

interface Props extends AppProps {
  authedUser: User | null;
}

const App = ({ Component, pageProps, authedUser }: Props) => {
  return (
    <AuthContextProvider initialState={{ authedUser }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  );
};

App.getInitialProps = async (context: AppContext) => {
  const ctx = await NextApp.getInitialProps(context);
  const req = context.ctx.req;

  const cookies = new Cookies(req?.headers.cookie);

  let authedUser = null;

  // Check if the user has a valid, non-expired auth token
  if (cookies.get(AUTH_COOKIE_NAME)) {
    const authToken = cookies.get(AUTH_COOKIE_NAME);
    const payload = jwt.decode(authToken) as jwt.JwtPayload;

    if (Date.now() < payload.exp * 1000) {
      try {
        const axios = createAxiosInstance(req);
        const response = await axios.get(`/api/users/${payload.user_id}`);
        authedUser = response.data || null;
      } catch (err) {
        // TODO: handle this in the client if it errors
        console.error(err);
      }
    }
  }

  return { ...ctx, authedUser };
};

export default App;
