import { useCallback } from 'react';
import { publicacionCacheService } from '../services/PublicacionCacheService';
import type { Publicacion } from '../types/PedidosInterface';

interface UsePublicacionCacheReturn {
  updateCache: (publicacion: Publicacion) => void;
  updateMultipleCache: (publicaciones: Publicacion[]) => void;
  refreshCache: (publicacionIds: number[]) => void;
  clearCache: () => void;
}

export const usePublicacionCache = (): UsePublicacionCacheReturn => {
  

  const updateCache = useCallback((publicacion: Publicacion) => {
    publicacionCacheService.set(publicacion.id, publicacion);
  }, []);


  const updateMultipleCache = useCallback((publicaciones: Publicacion[]) => {
    const publicacionesMap = new Map<number, Publicacion>();
    publicaciones.forEach(pub => {
      publicacionesMap.set(pub.id, pub);
    });
    publicacionCacheService.setMultiple(publicacionesMap);
  }, []);


  const refreshCache = useCallback((publicacionIds: number[]) => {
    publicacionCacheService.refreshMultiple(publicacionIds);
  }, []);


  const clearCache = useCallback(() => {
    publicacionCacheService.clear();
  }, []);


  return {
    updateCache,
    updateMultipleCache, 
    refreshCache,
    clearCache
  };
};