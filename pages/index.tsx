import { Box, Button, Container, Typography } from '@mui/material';
import jwt from 'jsonwebtoken';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Cookies from 'universal-cookie';

import createAxiosInstance from 'client/lib/axios';
import { getDiscordOauthUrl } from 'client/lib/oauth';
import { AUTH_COOKIE_NAME } from 'shared/constants';

interface Props {
  isAuthed: boolean;
  seenOnBoarding: boolean;
}

const Index: NextPage<Props> = props => {
  const [isAuthed, setIsAuthed] = React.useState(props.isAuthed);
  const [seenOnBoarding, setSeenOnBoarding] = React.useState(props.seenOnBoarding);
  const router = useRouter();

  // to avoid this error:
  // During Pre-rendering (SSR or SSG) you tried to access a router method push, replace, back, which is not supported.
  React.useEffect(() => {
    const { query } = router;
    if (query.seenOnBoarding === 'true') {
      setSeenOnBoarding(true);
      // reset query parameters once user gets back to home page
      router.replace({
        pathname: '/',
        query: {},
      });
    } else if (!seenOnBoarding && isAuthed) {
      router.push('/onBoarding');
    }
  }, []);

  const onLogout = async () => {
    const axios = createAxiosInstance();
    await axios.post('/api/auth/logout');
    setIsAuthed(false);
    setSeenOnBoarding(false);
  };

  return (
    <Container maxWidth='lg' className='flex justify-between pt-4'>
      <Typography variant='h1' className='text-3xl'>
        dev-directory
      </Typography>
      <Box className='flex items-center gap-4'>
        <Typography>You are {!isAuthed ? 'not' : ''} logged in</Typography>
        {isAuthed ? (
          <Button variant='contained' color='secondary' onClick={onLogout}>
            Log out
          </Button>
        ) : (
          <Button variant='contained' color='primary' href={getDiscordOauthUrl()}>
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

    return { isAuthed: true, seenOnBoarding: false };
  } catch (error) {
    return { isAuthed: false, seenOnBoarding: false };
  }
};

export default Index;
