import { Button } from '@mui/material';
import axios, { RawAxiosRequestConfig } from 'axios';
import { NextPage } from 'next';
import absoluteUrl from 'next-absolute-url';
import React from 'react';

import { getDiscordOauthUrl } from 'client/lib/oauth';

interface Props {
  isAuthed: boolean;
}

const Index: NextPage<Props> = (props) => {
  const [isAuthed, setIsAuthed] = React.useState(props.isAuthed);

  const onLogout = async () => {
    await axios.post('/api/auth/logout');
    setIsAuthed(false);
  };

  return (
    <div>
      <p>
        You are {!isAuthed ? 'not' : ''} logged in
      </p>
      {isAuthed ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={onLogout}
        >
          Log out
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          href={getDiscordOauthUrl()}
        >
          Log in
        </Button>
      )}
    </div>
  );
};

Index.getInitialProps = async ({ req }) => {
  const { origin } = absoluteUrl(req);
  try {
    const config: RawAxiosRequestConfig = req ? {
      withCredentials: true,
      headers: {
        cookie: req.headers.cookie,
      },
    } : {};
    await axios.get(`${origin}/api/users/`, config);
    return { isAuthed: true };
  } catch (err) {
    // an error likely means a 401 was thrown
    return { isAuthed: false };
  }
};

export default Index;
