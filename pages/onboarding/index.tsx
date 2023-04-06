import { Box, Button, Container, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Index: NextPage = () => {
  const router = useRouter();
  const onSkip = () => {
    router.push('/');
  };

  return (
    <Container maxWidth="lg" className="flex justify-between pt-4">
      <Typography variant="h1" className="text-3xl">
        Onboarding
      </Typography>
      <Box className="flex items-center gap-4">
        <Button variant="contained" color="secondary" onClick={onSkip}>
          Skip
        </Button>
      </Box>
    </Container>
  );
};

export default Index;
