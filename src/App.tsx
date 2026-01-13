import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {

  const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }

});

  return (
    <QueryClientProvider client={queryClient}>
    <AppTheme>
      <CartProvider>
        
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rutas con AppBar */}
          <Route path="/app" element={<AppLayout />}>
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

          </Route>
        </Routes>
      </BrowserRouter>
      <NotificationSnackbar />
      <ErrorNotifier  />
      </CartProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </AppTheme>
    </QueryClientProvider>
  );
}

export default App;
