import { Container } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';

interface Props {
  isAuthed: boolean;
}

const Index: NextPage<Props> = () => {
  return (
    <Container maxWidth="lg" className="flex justify-between pt-4">
      this is the home page
    </Container>
  );
};

export default Index;
