import type { Publicacion } from '@/types/PedidosInterface';

interface PublicacionCacheEntry {
    publicacion: Publicacion;
    timestamp: number;
    lastAccessed: number;
}

interface PublicacionCache {
    [key: number]: PublicacionCacheEntry;
}

interface PublicacionCacheStorage {
    cache: PublicacionCache;
    lastCleanup: string;
}

class PublicacionCacheService {
    private readonly CACHE_KEY = 'publicaciones_cache';
    private readonly CACHE_TTL = 30 * 60 * 1000; 
    private readonly MAX_ENTRIES = 500; 
    private readonly CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; 

    private getCacheStorage(): PublicacionCacheStorage {
        try {
            const data = localStorage.getItem(this.CACHE_KEY);
            if (!data) {
                return this.createEmptyCache();
            }

            const parsed: PublicacionCacheStorage = JSON.parse(data);
            


            return parsed;
        } catch (error) {
            console.error('Error reading publicaciones cache:', error);
            return this.createEmptyCache();
        }
    }

    private saveCacheStorage(data: PublicacionCacheStorage): void {
        try {
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving publicaciones cache:', error);
            this.clearExpired();
        }
    }

    private createEmptyCache(): PublicacionCacheStorage {
        return {
            cache: {},
            lastCleanup: new Date().toISOString()
        };
    }

    private isExpired(entry: PublicacionCacheEntry): boolean {
        const now = Date.now();
        return (now - entry.timestamp) > this.CACHE_TTL;
    }

    private shouldCleanup(storage: PublicacionCacheStorage): boolean {
        const now = Date.now();
        const lastCleanup = new Date(storage.lastCleanup).getTime();
        return (now - lastCleanup) > this.CLEANUP_INTERVAL;
    }

    get(publicacionId: number): Publicacion | null {
        try {
            const storage = this.getCacheStorage();
            const entry = storage.cache[publicacionId];

            if (!entry) {
                return null;
            }

            if (this.isExpired(entry)) {

                delete storage.cache[publicacionId];
                this.saveCacheStorage(storage);
                return null;
            }

            entry.lastAccessed = Date.now();
            storage.cache[publicacionId] = entry;
            this.saveCacheStorage(storage);

            return entry.publicacion;
        } catch (error) {
            console.error('Error getting publicacion from cache:', error);
            return null;
        }
    }


    set(publicacionId: number, publicacion: Publicacion): void {
        try {
            const storage = this.getCacheStorage();
            const now = Date.now();

            
            if (this.shouldCleanup(storage)) {
                this.performCleanup(storage);
            }

           
            const cacheKeys = Object.keys(storage.cache);
            if (cacheKeys.length >= this.MAX_ENTRIES) {
                
                this.removeLRU(storage);
            }

            
            storage.cache[publicacionId] = {
                publicacion,
                timestamp: now,
                lastAccessed: now
            };

            this.saveCacheStorage(storage);
        } catch (error) {
            console.error('Error saving publicacion to cache:', error);
        }
    }

    getMultiple(publicacionIds: number[]): Map<number, Publicacion> {
        const result = new Map<number, Publicacion>();
        
        for (const id of publicacionIds) {
            const publicacion = this.get(id);
            if (publicacion) {
                result.set(id, publicacion);
            }
        }

        return result;
    }

    setMultiple(publicaciones: Map<number, Publicacion>): void {
        for (const [id, publicacion] of publicaciones) {
            this.set(id, publicacion);
        }
    }

    has(publicacionId: number): boolean {
        const storage = this.getCacheStorage();
        const entry = storage.cache[publicacionId];
        
        if (!entry) {
            return false;
        }

        return !this.isExpired(entry);
    }

    refresh(publicacionId: number): void {
        try {
            const storage = this.getCacheStorage();
            const entry = storage.cache[publicacionId];

            if (entry) {
                entry.timestamp = Date.now();
                entry.lastAccessed = Date.now();
                storage.cache[publicacionId] = entry;
                this.saveCacheStorage(storage);
            }
        } catch (error) {
            console.error('Error refreshing publicacion cache:', error);
        }
    }

    refreshMultiple(publicacionIds: number[]): void {
        const storage = this.getCacheStorage();
        const now = Date.now();
        let updated = false;

        for (const id of publicacionIds) {
            const entry = storage.cache[id];
            if (entry) {
                entry.timestamp = now;
                entry.lastAccessed = now;
                updated = true;
            }
        }

        if (updated) {
            this.saveCacheStorage(storage);
        }
    }

    remove(publicacionId: number): void {
        try {
            const storage = this.getCacheStorage();
            if (storage.cache[publicacionId]) {
                delete storage.cache[publicacionId];
                this.saveCacheStorage(storage);
            }
        } catch (error) {
            console.error('Error removing publicacion from cache:', error);
        }
    }

    clearExpired(): number {
        try {
            const storage = this.getCacheStorage();
            const initialCount = Object.keys(storage.cache).length;
            
            for (const [id, entry] of Object.entries(storage.cache)) {
                if (this.isExpired(entry)) {
                    delete storage.cache[Number(id)];
                }
            }

            storage.lastCleanup = new Date().toISOString();
            this.saveCacheStorage(storage);

            const finalCount = Object.keys(storage.cache).length;
            const removed = initialCount - finalCount;
            

            return removed;
        } catch (error) {
            console.error('Error clearing expired publicaciones:', error);
            return 0;
        }
    }

    clear(): void {
        try {
            localStorage.removeItem(this.CACHE_KEY);
        } catch (error) {
            console.error('Error clearing publicaciones cache:', error);
        }
    }


    private performCleanup(storage: PublicacionCacheStorage): void {
        
        for (const [id, entry] of Object.entries(storage.cache)) {
            if (this.isExpired(entry as PublicacionCacheEntry)) {
                delete storage.cache[Number(id)];
            }
        }

        storage.lastCleanup = new Date().toISOString();
    }

    private removeLRU(storage: PublicacionCacheStorage): void {
        let oldestId: number | null = null;
        let oldestAccess = Date.now();

        for (const [id, entry] of Object.entries(storage.cache)) {
            const cacheEntry = entry as PublicacionCacheEntry;
            if (cacheEntry.lastAccessed < oldestAccess) {
                oldestAccess = cacheEntry.lastAccessed;
                oldestId = Number(id);
            }
        }

        if (oldestId !== null) {
            delete storage.cache[oldestId];
        }
    }
}

// Singleton instance
export const publicacionCacheService = new PublicacionCacheService();