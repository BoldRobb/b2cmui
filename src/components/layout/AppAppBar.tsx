import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useColorScheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {useLogoUrl} from '../../hooks/useLogo';
import { useCliente } from '../../hooks/useClienteData';
import { apiToken } from '../../api/ApiToken';
import { usePublicacionCache } from '../../hooks/usePublicacionCache';
import { useQueryClient } from '@tanstack/react-query';
import AccountBox from '@mui/icons-material/AccountBox';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge } from '@mui/material';
import { useCartContext } from '../../context/CartContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

const ColorModeSwitch = () => {
  const { mode, setMode } = useColorScheme();

  const handleToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <IconButton 
      onClick={handleToggle}
      
      sx={{
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        color: mode === 'dark' ? 'common.white' : 'common.black',
      }}
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default function AppAppBar() {

  const { count } = useCartContext();
  const cartCount = count;

  const { data: cliente } = useCliente();
  const isAdmin = apiToken.isAdmin();
  const { clearCache } = usePublicacionCache();
  const queryClient = useQueryClient();
  const { data: logoClaro } = useLogoUrl('fondo-claro'); // React Query para el logo
  const { data: logoOscuro } = useLogoUrl('fondo-oscuro'); // React Query para el logo
  const [documentosAnchor, setDocumentosAnchor] = React.useState<null | HTMLElement>(null);
  const [configuracionAnchor, setConfiguracionAnchor] = React.useState<null | HTMLElement>(null);
  const [consultasAnchor, setConsultasAnchor] = React.useState<null | HTMLElement>(null);
  const [ecommerceAnchor, setEcommerceAnchor] = React.useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { mode } = useColorScheme();

  const displayName = cliente?.nombre || (cliente ? cliente.nombre : 'Administrador') || 'Cliente';


  const handleDocumentosClick = (event: React.MouseEvent<HTMLElement>) => {
    setDocumentosAnchor(event.currentTarget);
  };
  const handleConfiguracionClick = (event: React.MouseEvent<HTMLElement>) => {
    setConfiguracionAnchor(event.currentTarget);
  }

  const handleConsultasClick = (event: React.MouseEvent<HTMLElement>) => {
    setConsultasAnchor(event.currentTarget);
  };

  const handleEcommerceClick = (event: React.MouseEvent<HTMLElement>) => {
    setEcommerceAnchor(event.currentTarget);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => setProfileAnchor(null);
  const renderMainBox = () =>{
    return(
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img 
                src={mode === 'dark' ? logoOscuro : logoClaro} 
                alt="Logo" 
                style={{ height: '32px' }}
              />
              <IconButton 
                color="info"
                onClick={() => navigate('/app/landing')}
                sx={{
                  border: 0,                  
                  color: mode === 'dark' ? 'common.white' : 'common.black',
                  backgroundColor: 'transparent !important',
                }}
              >
                <HomeIcon fontSize="medium" />
              </IconButton>
            </Box>
    )
  }
  const handleLogout = () => {
    handleProfileClose();
    apiToken.removeToken();
    clearCache();
    queryClient.clear();
    navigate('/login');
  };

  const handleCloseMenus = () => {
    setDocumentosAnchor(null);
    setConsultasAnchor(null);
    setEcommerceAnchor(null);
    setConfiguracionAnchor(null);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        {!isAdmin && (
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, gap: 2 }}>
            {renderMainBox()}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small"
                onClick={() => navigate('/app/dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleDocumentosClick}
              >
                Documentos
              </Button>
              <Menu
                anchorEl={documentosAnchor}
                open={Boolean(documentosAnchor)}
                onClose={handleCloseMenus}
                slotProps={{
                  paper: {
                    sx: {
                      backdropFilter: 'blur(24px)',
                      backgroundColor: (theme) => theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
                        : alpha(theme.palette.background.default, 0.4),
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 1,
                    }
                  }
                }}
              >
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/facturas'); }}>Facturas</MenuItem>
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/notas-devolucion'); }}>Notas de Devolución</MenuItem>
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/pagos'); }}>Pagos</MenuItem>
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/otros-documentos'); }}>Otros Documentos</MenuItem>
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/facturas-servicios'); }}>Facturas de Servicios</MenuItem>
              </Menu>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleConsultasClick}
              >
                Consultas
              </Button>
              <Menu
                anchorEl={consultasAnchor}
                open={Boolean(consultasAnchor)}
                onClose={handleCloseMenus}
                slotProps={{
                  paper: {
                    sx: {
                      backdropFilter: 'blur(24px)',
                      backgroundColor: (theme) => theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
                        : alpha(theme.palette.background.default, 0.4),
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 1,
                    }
                  }
                }}
              >
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/antiguedad-saldos'); }}>Antigüedad de Saldos</MenuItem>
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/pedidos'); }}>Pedidos</MenuItem>
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/cotizaciones'); }}>Cotizaciones</MenuItem>
              </Menu>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleEcommerceClick}
                
              >
                E-Commerce
              </Button>
              <Menu
                anchorEl={ecommerceAnchor}
                open={Boolean(ecommerceAnchor)}
                onClose={handleCloseMenus}
                slotProps={{
                  paper: {
                    sx: {
                      backdropFilter: 'blur(24px)',
                      backgroundColor: (theme) => theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
                        : alpha(theme.palette.background.default, 0.4),
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 1,
                    }
                  }
                }}
              >
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/catalogo'); }}>Catálogo</MenuItem>
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/ordenes'); }}>Órdenes</MenuItem>
              </Menu>

            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Tooltip title="Carrito">
              <IconButton color="primary"
              onClick={() => {  navigate('/app/carrito'); }}
               aria-label='carrito'>
              <Badge badgeContent={cartCount} color="primary" sx={{padding:'5px'}} max={99}>
                <ShoppingCartIcon sx={{fontSize:'32'}}/>
              </Badge>
                
              </IconButton>
            </Tooltip>
            <Tooltip title="Perfil">
              <IconButton
                onClick={handleProfileClick}
                aria-label="perfil"
                sx={{
                  p: 0.5,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Avatar
                  alt={displayName}
                  sx={{ width: 32, height: 32, backgroundColor: 'transparent', color: 'inherit' }}
                >
                  <AccountBox />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={handleProfileClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    minWidth: 220,
                    backdropFilter: 'blur(12px)',
                    backgroundColor: (theme) => theme.vars
                      ? `rgba(${theme.vars.palette.background.paperChannel} / 0.8)`
                      : alpha(theme.palette.background.paper, 0.8),
                    border: '1px solid',
                    borderColor: 'divider',
                  },
                },
              }}
            >
              <MenuItem disabled sx={{ opacity: 1, fontWeight: 600 }}>
                {displayName}
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={() => { handleProfileClose(); navigate('/app/ordenes'); }}>
                Mis ordenes
              </MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
            <ColorModeSwitch />
          </Box>
          
        </StyledToolbar>
        )}
        {isAdmin && (
          <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, gap: 2 }}>
              {renderMainBox()}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small"
                onClick={() => navigate('/app/historial')}
              >
                Historial
              </Button>
              <Button 
                variant="text" 
                color="info" 
                size="small"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleConfiguracionClick}
              >
                Configuración
              </Button>
              <Menu
                anchorEl={configuracionAnchor}
                open={Boolean(configuracionAnchor)}
                onClose={handleCloseMenus}
                slotProps={{
                  paper: {
                    sx: {
                      backdropFilter: 'blur(24px)',
                      backgroundColor: (theme) => theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
                        : alpha(theme.palette.background.default, 0.4),
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 1,
                    }
                  }
                }}
              >
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/configuracion'); }}>General</MenuItem>
                <MenuItem onClick={() => { handleCloseMenus(); navigate('/app/configuracion-facturacion'); }}>Facturación</MenuItem>
              </Menu>
              
          
            </Box>
            
            </Box>
            <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Tooltip title="Perfil">
              <IconButton
                onClick={handleProfileClick}
                aria-label="perfil"
                sx={{
                  p: 0.5,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Avatar
                  alt={displayName}
                  sx={{ width: 32, height: 32, backgroundColor: 'transparent', color: 'inherit' }}
                >
                  <AccountBox />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={handleProfileClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    minWidth: 220,
                    backdropFilter: 'blur(12px)',
                    backgroundColor: (theme) => theme.vars
                      ? `rgba(${theme.vars.palette.background.paperChannel} / 0.8)`
                      : alpha(theme.palette.background.paper, 0.8),
                    border: '1px solid',
                    borderColor: 'divider',
                  },
                },
              }}
            >
              <MenuItem disabled sx={{ opacity: 1, fontWeight: 600 }}>
                {apiToken.getCurrentUserSub()}
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
            <ColorModeSwitch />
          </Box>
          </StyledToolbar>

        )}
      </Container>
    </AppBar>
  );
}