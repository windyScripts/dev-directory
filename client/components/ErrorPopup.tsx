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

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} data-cy="errorpopup">
      <Alert onClose={handleClose} severity="error" elevation={6} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
