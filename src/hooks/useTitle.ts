import { useEffect } from 'react';
import { apiConfiguracion } from '../api/ApiConfiguracion';
import { useQuery, useQueryClient } from '@tanstack/react-query';


export function useAppInfo() {
  return useQuery({
    queryKey: ['app-info'],
    queryFn: () => apiConfiguracion.getAppInfo(),
    staleTime: 1000 * 60 * 60 * 5, 
    retry: 2,
  });
}

export const useDocumentTitle = (defaultTitle: string = 'b2c') => {
  const queryClient = useQueryClient();
  const { data: appInfo, isLoading, refetch } = useAppInfo();

  // Actualizar el título del documento cuando cambia la data
  useEffect(() => {
    if (appInfo?.['app.name']) {
      document.title = appInfo['app.name'];
    } else if (!isLoading) {
      document.title = defaultTitle;
    }
  }, [appInfo, defaultTitle, isLoading]);


  const recargarTituloDesdeServidor = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['app-info'] });
      await refetch();
    } catch (error) {
      console.error('Error al recargar título:', error);
    }
  };

  return {
    titulo: appInfo?.['app.name'] || defaultTitle,
    version: appInfo?.['app.version'] || '',
    recargarTituloDesdeServidor,
    isLoading,
  };
};