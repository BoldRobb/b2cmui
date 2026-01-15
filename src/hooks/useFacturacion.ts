import { useQuery } from '@tanstack/react-query';
import { apiFacturacion } from '../api/ApiFacturacion';
import { useLogoUrl } from './useLogo';


export function useCamposFacturacion() {
  return useQuery({
    queryKey: ['facturacion', 'campos'],
    queryFn: () => apiFacturacion.obtenerCamposFacturacion(),
    staleTime: 1000 * 60 * 30, 
    retry: 2,
  });
}

export function useEstiloFacturacion() {
  return useQuery({
    queryKey: ['facturacion', 'estilo'],
    queryFn: () => apiFacturacion.getEstilo(),
    staleTime: 1000 * 60 * 60, 
    retry: 2,
  });
}

export function useConfiguracionValida() {
  return useQuery({
    queryKey: ['facturacion', 'configuracion-valida'],
    queryFn: () => apiFacturacion.configuracionValida(),
    staleTime: 1000 * 60 * 30, 
    retry: 2,
  });
}



export function useFacturacionData() {
  const campos = useCamposFacturacion();
  const configuracionValida = useConfiguracionValida();
  const logoOscuro = useLogoUrl('fondo-oscuro'); 
  const logoClaro = useLogoUrl('fondo-claro');
  const estilo = useEstiloFacturacion();
  return {
    campos: campos.data,
    configuracionValida: configuracionValida.data ?? false,
    logoOscuroUrl: logoOscuro.data ?? '',
    logoClaroUrl: logoClaro.data ?? '',
    estilo: estilo.data ?? 'OSCURO',
    isLoading: campos.isLoading || configuracionValida.isLoading || logoOscuro.isLoading || logoClaro.isLoading,
    isLoadingCampos: campos.isLoading,
    isError: campos.isError || configuracionValida.isError,
    error: campos.error || configuracionValida.error,
  };
}
