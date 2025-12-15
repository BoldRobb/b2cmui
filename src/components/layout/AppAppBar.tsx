import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
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
      color="primary"
      sx={{
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
      }}
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [documentosAnchor, setDocumentosAnchor] = React.useState<null | HTMLElement>(null);
  const [consultasAnchor, setConsultasAnchor] = React.useState<null | HTMLElement>(null);
  const [ecommerceAnchor, setEcommerceAnchor] = React.useState<null | HTMLElement>(null);
  const [documentosOpenMobile, setDocumentosOpenMobile] = React.useState(false);
  const [consultasOpenMobile, setConsultasOpenMobile] = React.useState(false);
  const [ecommerceOpenMobile, setEcommerceOpenMobile] = React.useState(false);
  const navigate = useNavigate();
  const { mode } = useColorScheme();

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
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img 
                src={mode === 'dark' ? '/macronnect-logo.png' : '/macronnect-logo-color.png'} 
                alt="Macronnect Logo" 
                style={{ height: '32px' }}
              />
              <IconButton 
                color="info"
                onClick={() => navigate('/app/landing')}
                sx={{
                  border: 0,
                }}
              >
                <HomeIcon fontSize="small" />
              </IconButton>
            </Box>
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
                <MenuItem onClick={handleCloseMenus}>Notas de Devolución</MenuItem>
                <MenuItem onClick={handleCloseMenus}>Pagos</MenuItem>
                <MenuItem onClick={handleCloseMenus}>Otros Documentos</MenuItem>
                <MenuItem onClick={handleCloseMenus}>Facturas de Servicios</MenuItem>
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
                <MenuItem onClick={handleCloseMenus}>Antigüedad de Saldos</MenuItem>
                <MenuItem onClick={handleCloseMenus}>Pedidos</MenuItem>
                <MenuItem onClick={handleCloseMenus}>Cotizaciones</MenuItem>
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
                <MenuItem onClick={handleCloseMenus}>Catálogo</MenuItem>
                <MenuItem onClick={handleCloseMenus}>Órdenes</MenuItem>
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
            <Button color="primary" variant="text" size="small">
              Carrito
            </Button>
            <Button color="primary" variant="contained" size="small">
              Perfil
            </Button>
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
                  <Button color="primary" variant="outlined" fullWidth>
                    Perfil
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}