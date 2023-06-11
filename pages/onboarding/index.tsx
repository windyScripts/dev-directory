import { Box, Button, Container, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import createAxiosInstance from 'client/lib/axios';

const Onboarding: NextPage = () => {
  const router = useRouter();

  const handleSkipOnboarding = async () => {
    try {
      const axios = createAxiosInstance();
      await axios.put('/api/users/onboarding/skip');
      router.push('/directory');
    } catch (error) {
      return { error: error.message };
    }
  };

  return (
    <Container maxWidth="lg" className="flex justify-between pt-4">
      <Typography variant="h1" className="text-3xl">
        Onboarding
      </Typography>
      <Box className="flex items-center gap-4">
        <Button variant="contained" color="secondary" onClick={handleSkipOnboarding} >
          Skip
        </Button>
      </Box>
    </Container>
  );
};

export default Onboarding;
