import { CircularProgress, Container } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';

import { useAuthDispatch } from 'client/contexts/auth';
import { FlagName } from 'shared/Flag';
import { CurrentUserResponse } from 'shared/http';

const AuthRedirect: React.FC = () => {
  const router = useRouter();
  const authDispatch = useAuthDispatch();

  const useAuthCode = async (code: string) => {
    const res = await axios.post<CurrentUserResponse>('/api/auth/login', { code });
    authDispatch({ type: 'SET_AUTHED_USER', user: res.data.user });
    authDispatch({ type: 'SET_FLAGS', flags: res.data.flags });
    if (res.data.flags.includes(FlagName.SKIPPED_ONBOARDING)) {
      router.push('/directory');
      return;
    }
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
