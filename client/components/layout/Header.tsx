import React from 'react';
import { Box } from '@mui/material';
import Link from 'next/link';
import Navigation from './Navigation';

const Header: React.FC = () => {
  return (
    <Box
      component="header"
      className="flex align-baseline justify-between p-3"
    >
      <Link href="/">
        <button className="text-lg bg-transparent border-none cursor-pointer">
          PairUp
        </button>
      </Link>
      <Navigation />
    </Box>
  );
};

export default Header;
