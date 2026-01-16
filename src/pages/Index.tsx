import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppTheme from '../assets/shared-theme/AppTheme';
import Content from '../components/LoginContent';
import FacturaBuscarCard from '../components/forms/FacturaBuscarCard';

const ColorModeSwitch = () => {
  const { mode, setMode } = useColorScheme();
  const handleToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <IconButton 
      onClick={handleToggle}
      sx={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        color: mode === 'dark' ? 'common.white' : 'common.black',
      }}
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default function Home(props: { disableCustomTheme?: boolean }) {
  const location = useLocation();
  const [showFacturaCard, setShowFacturaCard] = useState(false);

  useEffect(() => {
    // Verificar la ruta y setear el estado inicial
    if (location.pathname === '/facturacion' || location.pathname.startsWith('/facturacion/')) {
      setShowFacturaCard(true);
    } else {
      setShowFacturaCard(false);
    }
  }, [location.pathname]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSwitch />
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            minHeight: '100vh',
          },
          (theme) => ({
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              zIndex: -1,
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
              backgroundRepeat: 'no-repeat',
              ...theme.applyStyles('dark', {
                backgroundImage:
                  'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
              }),
            },
          }),
        ]}
      >
        <Stack
          direction={{ md: 'row' }}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: {  sm: 12 },
            p: 2,
            mx: 'auto',
            height: '100%',
          }}
        >
          <Content />
          <Box sx={{ position: 'relative', minWidth: { sm: '450px' }, minHeight: '400px', display: 'flex', alignItems: 'center' }}>
            <Fade in={showFacturaCard} timeout={500} unmountOnExit>
              <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' }}>
                <FacturaBuscarCard onBack={() => setShowFacturaCard(false)} />
              </Box>
            </Fade>
          </Box>
        </Stack>
      </Stack>
    </AppTheme>
  );
}
