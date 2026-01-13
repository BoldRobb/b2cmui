import { useQuery } from '@tanstack/react-query';
import { apiCatalogo } from '../api/ApiCatalogo';
import { apiToken } from '../api/ApiToken';

export function useCategorias() {
  return useQuery({
    queryKey: ['catalogo', 'categorias'],
    queryFn: () => apiCatalogo.getCategorias(),
    enabled: apiToken.isAuthenticated(),
    staleTime: 1000 * 60 * 60, 
  });
}


export function usePublicacionesBase() {
  return useQuery({
    queryKey: ['catalogo', 'publicaciones', 'base'],
    queryFn: () => apiCatalogo.getPublicaciones('', null, null, '', null, {
      page: 1,
      size: 10,
      sort: 'precio,desc'
    }),
    enabled: apiToken.isAuthenticated(),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublicacionId(id: number) {
return useQuery({
    queryKey: ['catalogo', 'publicacion', id],
    queryFn: () => apiCatalogo.getPublicacionById(id),
    enabled: apiToken.isAuthenticated() && id != 0,
    staleTime: 1000 * 60 * 15,
})}

export function usePublicacionIdExistencias(id: number) {
return useQuery({
    queryKey: ['catalogo', 'publicacion', id, 'existencias'],
    queryFn: () => apiCatalogo.getPublicacionesExistenciasById(id),
    enabled: apiToken.isAuthenticated() && id != 0,
    staleTime: 1000 * 60 * 15,

})}

export function useArticuloData(id: number) {

    const publicacion = usePublicacionId(id);
    const existencias = usePublicacionIdExistencias(id);
    const categorias = useCategorias();

    return {
        publicacion: publicacion.data,
        existencias: existencias.data,
        categorias: categorias.data,
        isLoading: publicacion.isLoading || existencias.isLoading || categorias.isLoading,
        isError: publicacion.isError || existencias.isError || categorias.isError,
        
    }
}

export function useCatalogoData() {
  const categorias = useCategorias();
  const publicaciones = usePublicacionesBase();

  return {
    categorias: categorias.data,
    publicaciones: publicaciones.data,
    isLoading: categorias.isLoading || publicaciones.isLoading,
    isError: categorias.isError || publicaciones.isError,
    error: publicaciones.error || categorias.error,
  };
}
