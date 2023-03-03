import { CssBaseline } from '@mui/material';
import React from 'react';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <CssBaseline enableColorScheme />
      <main>{children}</main>
    </>
  );
};

export default Layout;
