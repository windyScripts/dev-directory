import { Box, Button, Container, Typography } from '@mui/material';
import { NextPage } from 'next';
import Link from 'next/link';

const Onboarding: NextPage = () => {
  return (
    <Container maxWidth="lg" className="flex justify-between pt-4">
      <Typography variant="h1" className="text-3xl">
        Onboarding
      </Typography>
      <Box className="flex items-center gap-4">
        <Link href="/" passHref>
          <Button variant="contained" color="secondary">
            Skip
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default Onboarding;
