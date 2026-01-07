import { useState } from "react";
import type { DocumentoDetallado } from "../types/PedidosInterface";

const CACHE_EXPIRY_DAYS = 7;

interface CachedDocumento {
    data: DocumentoDetallado;
    timestamp: number;
}

export const useDocumentosDetallados = (cacheKey: string) => {
    const saveToPersistentCache = (documentoId: number, documento: DocumentoDetallado): void => {
        try {
            const cached = getPersistentCache();
            cached[documentoId] = {
                data: documento,
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(cached));
        } catch (error) {
            console.warn(`Error guardando en caché persistente (${cacheKey}):`, error);
        }
    };

    const getPersistentCache = (): Record<number, CachedDocumento> => {
        try {
            const cached = localStorage.getItem(cacheKey);
            return cached ? JSON.parse(cached) : {};
        } catch (error) {
            console.warn(`Error leyendo caché persistente (${cacheKey}):`, error);
            return {};
        }
    };

    const getFromPersistentCache = (documentoId: number): DocumentoDetallado | null => {
        try {
            const cached = getPersistentCache();
            const item = cached[documentoId];
            
            if (!item) return null;
            
            const isExpired = Date.now() - item.timestamp > (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
            if (isExpired) {
                delete cached[documentoId];
                localStorage.setItem(cacheKey, JSON.stringify(cached));
                return null;
            }
            
            return item.data;
        } catch (error) {
            console.warn(`Error obteniendo de caché persistente (${cacheKey}):`, error);
            return null;
        }
    };

    const clearPersistentCache = (): void => {
        try {
            localStorage.removeItem(cacheKey);
        } catch (error) {
            console.warn(`Error limpiando caché persistente (${cacheKey}):`, error);
        }
    };

    const initializeFromCache = (): Map<number, DocumentoDetallado> => {
        const cached = getPersistentCache();
        const map = new Map<number, DocumentoDetallado>();
        
        Object.entries(cached).forEach(([id, item]) => {
            const isExpired = Date.now() - item.timestamp > (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
            if (!isExpired) {
                map.set(Number(id), item.data);
            }
        });
        
        return map;
    };

    // Estados del hook
    const [expandedDocumentos, setExpandedDocumentos] = useState<Set<number>>(new Set());
    const [documentosDetallados, setDocumentosDetallados] = useState<Map<number, DocumentoDetallado>>(() => {
        return initializeFromCache();
    });
    const [loadingDetalles, setLoadingDetalles] = useState<Set<number>>(new Set());

    const toggleDetalles = async (
        documentoId: number, 
        fetchDetailFunction: (id: string) => Promise<DocumentoDetallado>
    ) => {
        if (expandedDocumentos.has(documentoId)) {
            setExpandedDocumentos(new Set());
            return;
        }
        
        const newExpanded = new Set<number>();
        newExpanded.add(documentoId);
        setExpandedDocumentos(newExpanded);  

        if (!documentosDetallados.has(documentoId)) {
            const cachedData = getFromPersistentCache(documentoId);
            
            if (cachedData) {
                setDocumentosDetallados(prev => new Map(prev).set(documentoId, cachedData));
            } else {
                setLoadingDetalles(prev => new Set(prev).add(documentoId));
                
                try {
                    const documentoDetallado = await fetchDetailFunction(documentoId.toString());
                    
                    setDocumentosDetallados(prev => new Map(prev).set(documentoId, documentoDetallado));
                    saveToPersistentCache(documentoId, documentoDetallado);
                } catch (error) {
                    console.error('Error al cargar detalles del documento:', error);
                    setExpandedDocumentos(new Set());
                } finally {
                    setLoadingDetalles(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(documentoId);
                        return newSet;
                    });
                }
            }
        }
    };

    const resetExpanded = () => {
        setExpandedDocumentos(new Set());
    };

    return {
        // Estados
        expandedDocumentos,
        documentosDetallados,
        loadingDetalles,
        
        // Funciones
        toggleDetalles,
        resetExpanded,
        clearCache: clearPersistentCache,
        
        // Utilidades
        isExpanded: (id: number) => expandedDocumentos.has(id),
        isLoading: (id: number) => loadingDetalles.has(id),
        getDetalle: (id: number) => documentosDetallados.get(id),
    };
};