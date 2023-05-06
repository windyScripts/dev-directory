import jwt from 'jsonwebtoken';
import NextApp, { AppContext, AppProps } from 'next/app';
import React from 'react';
import Cookies from 'universal-cookie';
import 'client/styles/globals.css';

import Layout from 'client/components/layout/Layout';
import { AuthContextProvider } from 'client/contexts/auth';
import { AUTH_COOKIE_NAME } from 'shared/constants';

interface Props extends AppProps {
  isAuthed: boolean;
}

const App = ({ Component, pageProps, isAuthed }: Props) => {
  return (
    <AuthContextProvider initialState={{ authed: isAuthed }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  );
};

App.getInitialProps = async (context: AppContext) => {
  const ctx = await NextApp.getInitialProps(context);

  const cookies = new Cookies(context.ctx.req?.headers.cookie);

  let isAuthed = false;

  // Check if the user has a valid, non-expired auth token
  if (cookies.get(AUTH_COOKIE_NAME)) {
    const authToken = cookies.get(AUTH_COOKIE_NAME);
    const payload = jwt.decode(authToken) as jwt.JwtPayload;
    if (Date.now() < payload.exp * 1000) {
      isAuthed = true;
    }
  }

  return { ...ctx, isAuthed };
};

export default App;
