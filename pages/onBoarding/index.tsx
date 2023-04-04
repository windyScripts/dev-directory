import { Box, Button, Container, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Index: NextPage = () => {
  const router = useRouter();
  const onDismiss = () => {
    router.push('/?seenOnBoarding=true');
  };

  return (
    <Container maxWidth='lg' className='flex justify-between pt-4'>
      <Typography variant='h1' className='text-3xl'>
        OnBoarding
      </Typography>
      <Box className='flex items-center gap-4'>
        <Button variant='contained' color='secondary' onClick={onDismiss}>
          Dismiss
        </Button>
      </Box>
    </Container>
  );
};

export default Index;
