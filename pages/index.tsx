import { Container } from '@mui/material';
import jwt from 'jsonwebtoken';
import { NextPage } from 'next';
import React from 'react';
import Cookies from 'universal-cookie';

import createAxiosInstance from 'client/lib/axios';
import { AUTH_COOKIE_NAME } from 'shared/constants';

interface Props {
  isAuthed: boolean;
}

const Index: NextPage<Props> = props => {
  return (
    <Container maxWidth="lg" className="flex justify-between pt-4">
      this is the home page
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
