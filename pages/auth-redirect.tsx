import { useRouter } from 'next/router';
import React from 'react';
import axios from 'axios'
import { CircularProgress } from '@mui/material';

const Index: React.FC = () => {
  const router = useRouter()

  const useAuthCode = async (code: string) => {
    await axios.post('/api/auth/login', { code })
    router.push('/')
  }

  React.useEffect(() => {
    if (router.query.code) {
      useAuthCode(String(router.query.code))
    }
  }, [router.query.code])

  return (
    <div><CircularProgress /></div>
  );
};

export default Index;
