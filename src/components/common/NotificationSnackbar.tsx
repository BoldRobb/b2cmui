import { useEffect, useState } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { notificationService } from '../../services/notificationService';
import CloseIcon from '@mui/icons-material/Close';

export default function NotificationSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [autoHideDuration, setAutoHideDuration] = useState<number | null>(6000);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      if (notification === null) {
        setOpen(false);
      } else {
        setMessage(notification.message);
        setVariant(notification.variant);
        setAutoHideDuration(notification.persist ? null : 6000);
        setOpen(true);
      }
    });

    return unsubscribe;
  }, []);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert action={
                  <IconButton
                    aria-label="cerrar"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                    sx={{ backgroundColor: 'transparent !important', borderColor: 'transparent !important', padding: 0 }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>} severity={variant} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
