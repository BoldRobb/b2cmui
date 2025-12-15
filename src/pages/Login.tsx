import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorScheme } from '@mui/material/styles';
import AppTheme from '../assets/shared-theme/AppTheme';
import LoginCard from '../components/forms/LoginCard';
import Content from '../components/LoginContent';

const ColorModeSwitch = () => {
  const { mode, setMode } = useColorScheme();

  const handleToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <IconButton 
      onClick={handleToggle}
      color="primary"
      sx={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
      }}
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default function Login(props: { disableCustomTheme?: boolean }) {
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
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: 'auto',
            height: '100%',
          }}
        >
          <Content />
          <LoginCard />
        </Stack>
      </Stack>
    </AppTheme>
  );
}
