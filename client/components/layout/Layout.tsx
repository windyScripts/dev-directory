import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack'; // SnackbarProvider must be a child of ThemeProvider
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
      <SnackbarProvider maxSnack={1}>
        <CssBaseline enableColorScheme />
        <Header />
        <main>
          {children}
        </main>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Layout;
