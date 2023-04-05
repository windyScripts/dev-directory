import { Box, Button, Container, Typography } from '@mui/material';
import jwt from 'jsonwebtoken';
import { NextPage } from 'next';
import React from 'react';
import Cookies from 'universal-cookie';

import createAxiosInstance from 'client/lib/axios';
import { getDiscordOauthUrl } from 'client/lib/oauth';
import { AUTH_COOKIE_NAME } from 'shared/constants';

interface Props {
  isAuthed: boolean;
}

const Index: NextPage<Props> = props => {
  const [isAuthed, setIsAuthed] = React.useState(props.isAuthed);

  const onLogout = async () => {
    const axios = createAxiosInstance();
    await axios.post('/api/auth/logout');
    setIsAuthed(false);
  };

  return (
    <Container maxWidth="lg" className="flex justify-between pt-4">
      <Typography variant="h1" className="text-3xl">
        dev-directory
      </Typography>
      <Box className="flex items-center gap-4">
        <Typography>
          You are {!isAuthed ? 'not' : ''} logged in
        </Typography>
        {isAuthed ? (
          <Button variant="contained" color="secondary" onClick={onLogout}>
            Log out
          </Button>
        ) : (
          <Button variant="contained" color="primary" href={getDiscordOauthUrl()}>
            Log in
          </Button>
        )}
      </Box>
    </Container>
  );
};

Index.getInitialProps = async ({ req }) => {
  try {
    const cookies = new Cookies(req?.headers.cookie);
    const token = cookies.get(AUTH_COOKIE_NAME);
    const payload = jwt.decode(token) as jwt.JwtPayload;

    const axios = createAxiosInstance(req);
    await axios.get('/api/users/' + payload.user_id);

    return { isAuthed: true };
  } catch (error) {
    return { isAuthed: false };
  }
};

export default Index;
