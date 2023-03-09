import { useRouter } from 'next/router';
import React from 'react';
import axios from 'axios'

const Index: React.FC = () => {
  const router = useRouter()

  const useAuthCode = async (code: string) => {
    const res = await axios.post('/api/auth/discord', { code })
    console.log(res.status, res.data)
  }

  React.useEffect(() => {
    if (router.query.code) {
      useAuthCode(String(router.query.code))
    }
  }, [router.query.code])

  return (
    <div>hi</div>
  );
};

export default Index;
