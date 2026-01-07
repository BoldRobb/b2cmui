import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/ApiClient';
import { apiToken } from '../api/ApiToken';


export function useCliente() {
  return useQuery({
    queryKey: ['cliente'],
    queryFn: () => apiClient.getCliente(),
    enabled: apiToken.isAuthenticated() && !apiToken.isAdmin(),
    staleTime: 1000 * 60 * 60, 
  });
}


export function useDireccionCliente() {
  return useQuery({
    queryKey: ['cliente', 'direccion'],
    queryFn: () => apiClient.getDireccionCliente(),
    enabled: apiToken.isAuthenticated() && !apiToken.isAdmin(),
    staleTime: 1000 * 60 * 60, 
  });
}


export function useEstadisticasCliente() {
  return useQuery({
    queryKey: ['cliente', 'estadisticas'],
    queryFn: () => apiClient.getEstadisticasCliente(),
    enabled: apiToken.isAuthenticated() && !apiToken.isAdmin(),
    staleTime: 1000 * 60 * 3, 
  });
}


export function useColumnasVencimientos() {
  return useQuery({
    queryKey: ['cliente', 'columnas-vencimientos'],
    queryFn: () => apiClient.getColumnasVencimientos(),
    enabled: apiToken.isAuthenticated() && !apiToken.isAdmin(),
    staleTime: 1000 * 60 * 60,
  });
}


export function useDiasMaximosVencimiento() {
  return useQuery({
    queryKey: ['cliente', 'dias-maximos-vencimiento'],
    queryFn: () => apiClient.getDiasMaximosVencimiento(),
    enabled: apiToken.isAuthenticated() && !apiToken.isAdmin(),
    staleTime: 1000 * 60 * 60, 
  });
}


export function useDashboardData() {
  const cliente = useCliente();
  const direccion = useDireccionCliente();
  const estadisticas = useEstadisticasCliente();
  const columnas = useColumnasVencimientos();
  const diasMaximos = useDiasMaximosVencimiento();

  return {
    cliente: cliente.data,
    direccion: direccion.data,
    estadisticas: estadisticas.data,
    columnas: columnas.data,
    diasMaximos: diasMaximos.data,
    isLoading: cliente.isLoading || direccion.isLoading || estadisticas.isLoading || columnas.isLoading || diasMaximos.isLoading,
    isError: cliente.isError || direccion.isError || estadisticas.isError || columnas.isError || diasMaximos.isError,
    error: cliente.error || direccion.error || estadisticas.error || columnas.error || diasMaximos.error,
  };
}
