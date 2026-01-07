import { useQuery } from '@tanstack/react-query';
import { apiLogo, type LogoType } from '../api/ApiLogo';

export function useLogoBlob(tipo: LogoType) {
  return useQuery({
    queryKey: ['logo', tipo, 'blob'],
    queryFn: () => apiLogo.getLogoBlob(tipo),
    staleTime: Infinity, 
    gcTime: Infinity, 
    retry: 2,
  });
}

export function useLogoUrl(tipo: LogoType) {
  return useQuery({
    queryKey: ['logo', tipo, 'url'],
    queryFn: () => apiLogo.getLogoUrl(tipo),
    staleTime: Infinity, 
    gcTime: Infinity, 
    retry: 2,
  });
}

export function usePreloadLogos() {
  const logoClaro = useLogoUrl('fondo-claro');
  const logoOscuro = useLogoUrl('fondo-oscuro');

  return {
    isLoading: logoClaro.isLoading || logoOscuro.isLoading,
    isSuccess: logoClaro.isSuccess && logoOscuro.isSuccess,
    isError: logoClaro.isError || logoOscuro.isError,
  };
}
