import { Button } from '@mui/material';
import { useSnackbar, OptionsWithExtraProps } from 'notistack';
import React from 'react';

export function useAlert(/* props: {  snackbarId: string; successMessage: string; errorMessage: string } */) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const action = (snackbarId: string) => (
    <>
      <Button onClick={() => {
        closeSnackbar(snackbarId);
      }}>
        Dismiss
      </Button>
    </>
  );

  const successOptions: OptionsWithExtraProps<'success'> = { action, autoHideDuration: 6000, variant: 'success' };
  const errorOptions: OptionsWithExtraProps<'error'> = { action, autoHideDuration: 6000, variant: 'error' };
  return (
    [(message: string, props?: OptionsWithExtraProps<'success'>) => {
      enqueueSnackbar(message, { ...successOptions, ...props });
    },
    (message: string, props?: OptionsWithExtraProps<'error'>) => {
      enqueueSnackbar(message, { ...errorOptions, ...props });
    }]
  );
}
