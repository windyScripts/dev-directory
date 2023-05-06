import { CssBaseline } from '@mui/material';
import React from 'react';
import Header from './Header';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Layout;
