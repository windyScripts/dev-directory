import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import Header from './Header';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Layout: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <Header />
      <main>{children}</main>
    </ThemeProvider>
  );
};

export default Layout;
