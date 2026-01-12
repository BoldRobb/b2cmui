import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useColorScheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {useLogoUrl} from '../../hooks/useLogo';
import { useCliente } from '../../hooks/useClienteData';
import { apiToken } from '../../api/ApiToken';
import { usePublicacionCache } from '../../hooks/usePublicacionCache';
import { useQueryClient } from '@tanstack/react-query';
import AccountBox from '@mui/icons-material/AccountBox';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { localStorageCartService } from '../../services/LocalStorageCartService';
import { Badge } from '@mui/material';

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

  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    localStorageCartService.countItems().then((count) => setCartCount(count));
  }, []);

  const { data: cliente } = useCliente();
  const isAdmin = apiToken.isAdmin();
  const { clearCache } = usePublicacionCache();
  const queryClient = useQueryClient();
  const { data: logoClaro } = useLogoUrl('fondo-claro'); // React Query para el logo
  const { data: logoOscuro } = useLogoUrl('fondo-oscuro'); // React Query para el logo
  const [open, setOpen] = React.useState(false);
  const [documentosAnchor, setDocumentosAnchor] = React.useState<null | HTMLElement>(null);
  const [consultasAnchor, setConsultasAnchor] = React.useState<null | HTMLElement>(null);
  const [ecommerceAnchor, setEcommerceAnchor] = React.useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null);
  
  const [documentosOpenMobile, setDocumentosOpenMobile] = React.useState(false);
  const [consultasOpenMobile, setConsultasOpenMobile] = React.useState(false);
  const [ecommerceOpenMobile, setEcommerceOpenMobile] = React.useState(false);
  const navigate = useNavigate();
  const { mode } = useColorScheme();

  const displayName = cliente?.nombre || 'Cliente';

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleDocumentosClick = (event: React.MouseEvent<HTMLElement>) => {
    setDocumentosAnchor(event.currentTarget);
  };

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
              <IconButton color="primary" aria-label='carrito'>
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
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeSwitch />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <List>
                  <ListItemButton>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                  
                  <ListItemButton onClick={() => setDocumentosOpenMobile(!documentosOpenMobile)}>
                    <ListItemText primary="Documentos" />
                    {documentosOpenMobile ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={documentosOpenMobile} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Facturas" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Notas de Devolución" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Pagos" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Otros Documentos" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Facturas de Servicios" />
                      </ListItemButton>
                    </List>
                  </Collapse>

                  <ListItemButton onClick={() => setConsultasOpenMobile(!consultasOpenMobile)}>
                    <ListItemText primary="Consultas" />
                    {consultasOpenMobile ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={consultasOpenMobile} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Antigüedad de Saldos" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Pedidos" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Cotizaciones" />
                      </ListItemButton>
                    </List>
                  </Collapse>

                  <ListItemButton onClick={() => setEcommerceOpenMobile(!ecommerceOpenMobile)}>
                    <ListItemText primary="E-Commerce" />
                    {ecommerceOpenMobile ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={ecommerceOpenMobile} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Catálogo" />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemText primary="Órdenes" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </List>
                
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Carrito
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
        )}
        {isAdmin && (
          <StyledToolbar variant="dense" disableGutters>
            <Box>
              {renderMainBox()}
            </Box>
          </StyledToolbar>

        )}
      </Container>
    </AppBar>
  );
}