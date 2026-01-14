import { Avatar, Box, Card, Container, Skeleton, Typography,  } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useTitle";
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';

export default function HeroAdmin() {
      const navigate = useNavigate();
      const {version, titulo} = useDocumentTitle();
    return(
        <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: {  sm: 5 },
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
           Configuración del sistema:
          </Typography>

        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
            gap: 3,
            mt: 4,
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          <Card 
            onClick={() => navigate('/app/configuracion')}
            sx={{ p: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
               <SettingsIcon  fontSize="large"/>
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Configuración General
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visita el panel de configuración general para ajustar las preferencias de la aplicación
                </Typography>
              </Box>
            </Box>
          </Card>

          <Card 
            onClick={() => navigate('/app/configuracion-facturacion')}
            sx={{ p: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                <DescriptionIcon  fontSize="large"/>
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Configuración de Facturación
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visita el panel de configuración de facturación para ajustar los parámetros relacionados con la facturación en línea
                </Typography>
              </Box>
            </Box>
          </Card>

          
          
          
        </Box>
      </Container>
    );
    
}