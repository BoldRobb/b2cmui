import { useEffect, useState } from 'react';
import { Snackbar, Alert, IconButton, alpha, useTheme } from '@mui/material';
import { notificationService } from '../../services/notificationService';
import CloseIcon from '@mui/icons-material/Close';

export default function NotificationSnackbar() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [autoHideDuration, setAutoHideDuration] = useState<number | null>(6000);
  const [color, setColor] = useState<string>('info');
  
  // Función para obtener el color del tema
  const getColor = (colorPath: string) => {
    const paths = colorPath.split('.');
    let value: any = theme.palette;
    for (const path of paths) {
      value = value[path];
      if (!value) return theme.palette.info.light;
    }
    // Asegurar que siempre devuelve una string
    return typeof value === 'string' ? value : theme.palette.info.light;
  };
  
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      if (notification === null) {
        setOpen(false);
      } else {
        setMessage(notification.message);
        setVariant(notification.variant);
        setColor(notification.color );
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
      <Alert 
      action={
                  <IconButton
                    aria-label="cerrar"
                    
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                    sx={{ color: 'inherit !important', backgroundColor: 'transparent !important', borderColor: 'transparent !important', padding: 0 }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>} severity={variant} variant="filled" sx={{ width: '100%', backgroundColor: `${alpha(getColor(color), 0.5)} !important` }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
