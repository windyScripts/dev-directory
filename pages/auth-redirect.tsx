import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';

const AuthRedirect: React.FC = () => {
  const router = useRouter();

  const useAuthCode = async (code: string) => {
    await axios.post('/api/auth/login', { code });
    router.push('/onboarding');
  };

  React.useEffect(() => {
    if (router.query.code) {
      useAuthCode(String(router.query.code));
    }
  }, [router.query.code]);

  return (
    <div>
      <CircularProgress />
    </div>
  );
};

export default AuthRedirect;
