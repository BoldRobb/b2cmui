import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/Landing';
import AppLayout from './pages/layout/AppLayout';
import AppTheme from './assets/shared-theme/AppTheme';
import DashboardPage from './pages/Dashboard.tsx/Dashboard';
import FacturasPage from './pages/documentos.tsx/Facturas';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import PagosPage from './pages/documentos.tsx/Pagos';
import NotasDevolucionPage from './pages/documentos.tsx/Notas-devolucion';
import FacturasServiciosPage from './pages/documentos.tsx/Facturas-servicios';
import OtrosDocumentosPage from './pages/documentos.tsx/Otros-documentos';
import AntiguedadSaldosPage from './pages/consultas/AntiguedadSaldos';
import NotificationSnackbar from './components/common/NotificationSnackbar';
import { ErrorNotifier } from './api/errorHandler';
import PedidosPage from './pages/consultas/Pedidos';
import CotizacionesPage from './pages/consultas/Cotizaciones';
import OrdenesPage from './pages/ecommerce/Ordenes';
import { CartProvider } from './context/CartContext';
import CatalogoPage from './pages/ecommerce/Catalogo';
import CarritoPage from './pages/ecommerce/Carrito';
import HistorialPage from './pages/historial';
import ConfiguracionGeneralPage from './pages/configuracion/ConfiguracionGeneral';
import ConfiguracionFacturacionPage from './pages/configuracion/ConfiguracionFacturacion';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import Index from './pages/Index';
import { useDocumentTitle } from './hooks/useTitle';
import FacturacionPage from './pages/facturacion/FacturacionPage';
import FacturaPage from './pages/facturacion/FacturaPage';
import { useColorScheme } from '@mui/material/styles';
import { useEffect, useRef } from 'react';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }});

function ColorSchemeController() {
  const location = useLocation();
  const { mode, setMode } = useColorScheme();
  const previousModeRef = useRef<string | null>(null);

  useEffect(() => {
    const isFacturacionRoute = location.pathname.startsWith('/facturacion');

    if (isFacturacionRoute) {
      if (mode && mode !== 'light') {
        previousModeRef.current = mode;
      }
      if (mode !== 'light') {
        setMode('light');
      }
    } else {
      if (previousModeRef.current && mode === 'light') {
        setMode(previousModeRef.current as 'light' | 'dark' | 'system');
        previousModeRef.current = null;
      }
    }
  }, [location.pathname, mode, setMode]);

  return null;
}

function AppContent() {
  const { version } = useDocumentTitle();

  return(
    <AppTheme>
      <CartProvider>
        
      <BrowserRouter>
        <ColorSchemeController />
        <Routes>
          
          <Route path="/" element={<Login />} />
          <Route path="/facturacion" element={<Index />} />
          <Route path="/facturacion/facturar" element={<FacturacionPage />} />
          <Route path="/facturacion/factura" element={<FacturaPage />} />
          {/* Rutas protegidas con AppBar */}
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/app/landing" replace />} />

            {/* Paginas principales */}
            <Route path="landing" element={<LandingPage />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Paginas de documentos */}
            <Route path="facturas" element={<FacturasPage />} />
            <Route path="pagos" element={<PagosPage />} />
            <Route path="notas-devolucion" element={<NotasDevolucionPage />} />
            <Route path="facturas-servicios" element={<FacturasServiciosPage />} />
            <Route path="otros-documentos" element={<OtrosDocumentosPage />} />

            {/* Paginas de consultas */}
            <Route path="antiguedad-saldos" element={<AntiguedadSaldosPage />} />
            <Route path="pedidos" element={<PedidosPage />} />
            <Route path="cotizaciones" element={<CotizacionesPage />} />

            {/*E-commerce*/}
            <Route path="catalogo" element={<CatalogoPage />} />
            <Route path="ordenes" element={<OrdenesPage />} />
            <Route path="carrito" element={<CarritoPage />} />

            {/* Administrador - Solo admin */}
            <Route path="historial" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <HistorialPage />
              </RoleProtectedRoute>
            } />
            <Route path="configuracion" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <ConfiguracionGeneralPage />
              </RoleProtectedRoute>
            } />
            <Route path="configuracion-facturacion" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <ConfiguracionFacturacionPage />
              </RoleProtectedRoute>
            } />
          </Route>

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <NotificationSnackbar />
      <ErrorNotifier  />
      </CartProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </AppTheme>
  )
}

function App() {


  return (
    <QueryClientProvider client={queryClient}>
    <AppContent/>
    </QueryClientProvider>
  );
}

export default App;
