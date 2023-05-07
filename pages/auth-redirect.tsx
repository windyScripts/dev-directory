import { CircularProgress, Container } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';

import { useAuthDispatch } from 'client/contexts/auth';

const AuthRedirect: React.FC = () => {
  const router = useRouter();
  const authDispatch = useAuthDispatch();

  const useAuthCode = async (code: string) => {
    const res = await axios.post('/api/auth/login', { code });
    authDispatch({ type: 'SET_AUTHED_USER', user: res.data.user });
    router.push('/onboarding');
  };

  React.useEffect(() => {
    if (router.query.code) {
      useAuthCode(String(router.query.code));
    }
  }, [router.query.code]);

  return (
    <Container className="mt-6 flex justify-center">
      <CircularProgress />
    </Container>
  );
};

export default AuthRedirect;
