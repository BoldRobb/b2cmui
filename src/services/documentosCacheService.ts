import { clearPedidosCache } from "./pedidosCacheService";
import type { Publicacion } from "../types/PedidosInterface";

interface PublicacionesCacheEntry {
    publicaciones: Publicacion[];
    timestamp: number;
    expiry: number;
}

const ORDENES_CACHE_KEY = 'ordenes_publicaciones_cache';
const CACHE_DURATION_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 


export class OrdenesPublicacionesCache {
    
    static set(ordenId: number, publicaciones: Publicacion[]): void {
        try {
            const now = Date.now();
            const entry: PublicacionesCacheEntry = {
                publicaciones,
                timestamp: now,
                expiry: now + CACHE_DURATION_WEEK
            };


            const cache = this.getCache();
            cache[ordenId] = entry;

            localStorage.setItem(ORDENES_CACHE_KEY, JSON.stringify(cache));
        } catch (error) {
            console.warn('Error guardando publicaciones en caché:', error);
        }
    }

    static get(ordenId: number): Publicacion[] | null {
        try {
            const cache = this.getCache();
            const entry = cache[ordenId];

            if (!entry) return null;

            if (Date.now() > entry.expiry) {
                this.delete(ordenId);
                return null;
            }

            return entry.publicaciones;
        } catch (error) {
            console.warn('Error obteniendo publicaciones del caché:', error);
            return null;
        }
    }

    static delete(ordenId: number): void {
        try {
            const cache = this.getCache();
            delete cache[ordenId];
            localStorage.setItem(ORDENES_CACHE_KEY, JSON.stringify(cache));
        } catch (error) {
            console.warn('Error eliminando entrada del caché:', error);
        }
    }

    static clear(): void {
        try {
            localStorage.removeItem(ORDENES_CACHE_KEY);
        } catch (error) {
            console.warn('Error limpiando caché de publicaciones:', error);
        }
    }

    static cleanup(): void {
        try {
            const cache = this.getCache();
            const now = Date.now();
            let hasChanges = false;

            Object.keys(cache).forEach(key => {
                const ordenId = parseInt(key);
                const entry = cache[ordenId];
                
                if (entry && now > entry.expiry) {
                    delete cache[ordenId];
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                localStorage.setItem(ORDENES_CACHE_KEY, JSON.stringify(cache));
            }
        } catch (error) {
            console.warn('Error en limpieza de caché:', error);
        }
    }

    private static getCache(): Record<number, PublicacionesCacheEntry> {
        try {
            const stored = localStorage.getItem(ORDENES_CACHE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Error leyendo caché:', error);
            return {};
        }
    }

    static has(ordenId: number): boolean {
        const entry = this.getCache()[ordenId];
        if (!entry) return false;
        
        if (Date.now() > entry.expiry) {
            this.delete(ordenId);
            return false;
        }
        
        return true;
    }
}

export const clearOrdenesPublicacionesCache = (): void => {
    OrdenesPublicacionesCache.clear();
};

export const clearAllDocumentosCache = (): void => {

    clearPedidosCache();

    clearOrdenesPublicacionesCache();

    try {
        localStorage.removeItem('cotizaciones_detalladas_cache');
    } catch (error) {
        console.warn('Error limpiando caché de cotizaciones:', error);
    }
    
    clearOrdenesPublicacionesCache();
    
};

export const clearCotizacionesCache = (): void => {
    try {
        localStorage.removeItem('cotizaciones_detalladas_cache');
    } catch (error) {
        console.warn('Error limpiando caché de cotizaciones:', error);
    }
};

export const cleanupExpiredCaches = (): void => {
    OrdenesPublicacionesCache.cleanup();
};
