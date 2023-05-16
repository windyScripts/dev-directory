import { Alert, Snackbar } from '@mui/material';
import * as React from 'react';

export default function ErrorPopup({
  open = false,
  setOpen,
  message,
}: {
  open: boolean;
  setOpen: CallableFunction;
  message: string;
}) {
  const handleClose = () => {
    setOpen(false);
  };

  console.log('error component is being called with open set as ', open);

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" elevation={6} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
