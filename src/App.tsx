import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/Landing';
import AppLayout from './pages/layout/AppLayout';
import AppTheme from './assets/shared-theme/AppTheme';
import DashboardPage from './pages/Dashboard.tsx/Dashboard';
import FacturasPage from './pages/Facturas';

function App() {
  return (
    <AppTheme>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rutas con AppBar */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/landing" replace />} />
            <Route path="landing" element={<LandingPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="facturas" element={<FacturasPage />} />
            {/* Aquí puedes agregar más rutas que usen el layout */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AppTheme>
  );
}

export default App;
