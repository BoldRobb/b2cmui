import { Card,  Avatar, Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useTitle';

export default function HeroClient() {
  const navigate = useNavigate();
  const {version, titulo} = useDocumentTitle();
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',

        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
            }}
          >
            Bienvenido a&nbsp;
            {titulo ? (
              <Typography
                component="span"
                variant="h1"
                sx={(theme) => ({
                  fontSize: 'inherit',
                  color: 'primary.main',
                  ...theme.applyStyles('dark', {
                    color: 'primary.light',
                  }),
                })}
              >
                {titulo}
              </Typography>
            ) : (
              <Skeleton variant="text" width={200} height={50} />
            )}
          </Typography>
          {version ? (
            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                width: { sm: '100%', md: '80%' },
              }}
            >
              Version: {version}
            </Typography>
          ) : (
            <Skeleton variant="text" width={150} height={24} />
          )}
          <Typography
          variant='h2'
            sx={{
              textAlign: 'center',
              width: { sm: '100%', md: '80%' },
            }}
          >
           Te podría interesar:
          </Typography>

        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            mt: 4,
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          <Card 
            onClick={() => navigate('/app/dashboard')}
            sx={{ p: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                <DashboardIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vista general de tu actividad, reportes y métricas importantes
                </Typography>
              </Box>
            </Box>
          </Card>

          <Card 
            onClick={() => navigate('/app/facturas')}
            sx={{ p: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'info.light', width: 56, height: 56 }}>
                <DescriptionIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Mis Facturas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consulta y administra todas tus facturas y documentos fiscales
                </Typography>
              </Box>
            </Box>
          </Card>

          <Card 
            onClick={() => navigate('/app/antiguedad-saldos')}
            sx={{ p: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                <AssessmentIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Antigüedad de Saldos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Revisa el estado de tus cuentas y saldos pendientes
                </Typography>
              </Box>
            </Box>
          </Card>

          <Card 
          onClick={() => navigate('/app/cotizaciones')}
            sx={{ p: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
                <RequestQuoteIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Mis Cotizaciones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administra tus cotizaciones y solicitudes de presupuesto
                </Typography>
              </Box>
            </Box>
          </Card>

          <Card 
            sx={{ p: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.light', width: 56, height: 56 }}>
                <InventoryIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Catálogo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explora nuestro catálogo completo de productos y servicios
                </Typography>
              </Box>
            </Box>
          </Card>

          <Card 
            sx={{ p: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'error.light', width: 56, height: 56 }}>
                <ShoppingCartIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Mis Órdenes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rastrea y administra tus pedidos y compras realizadas
                </Typography>
              </Box>
            </Box>
          </Card>
          
        </Box>
      </Container>
    </Box>
  );
}
