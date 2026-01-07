import type { DocumentoDetallado } from "../types/PedidosInterface";


const CACHE_KEY = 'pedidos_detallados_cache';
const CACHE_EXPIRY_DAYS = 7;

interface CachedDocumento {
    data: DocumentoDetallado;
    timestamp: number;
}

export const saveToPersistentCache = (pedidoId: number, documento: DocumentoDetallado): void => {
    try {
        const cached = getPersistentCache();
        cached[pedidoId] = {
            data: documento,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch (error) {
        console.warn('Error guardando en caché persistente:', error);
    }
};


export const getPersistentCache = (): Record<number, CachedDocumento> => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : {};
    } catch (error) {
        console.warn('Error leyendo caché persistente:', error);
        return {};
    }
};


export const getFromPersistentCache = (pedidoId: number): DocumentoDetallado | null => {
    try {
        const cached = getPersistentCache();
        const item = cached[pedidoId];
        
        if (!item) return null;
        const isExpired = Date.now() - item.timestamp > (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        if (isExpired) {
            delete cached[pedidoId];
            localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
            return null;
        }
        
        return item.data;
    } catch (error) {
        console.warn('Error obteniendo de caché persistente:', error);
        return null;
    }
};


export const clearPedidosCache = (): void => {
    try {
        localStorage.removeItem(CACHE_KEY);
    } catch (error) {
        console.warn('Error limpiando caché persistente:', error);
    }
};

export const initializePedidosFromCache = (): Map<number, DocumentoDetallado> => {
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