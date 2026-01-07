import { apiOrdenes } from '@/api/ApiOrdenes';
import { apiCatalogo } from '@/api/ApiCatalogo';
import { apiToken } from '@/api/ApiToken';
import type { CarroItem, CarroResponse } from '@/types/CarritoInterface';
import type { Publicacion } from '@/types/PedidosInterface';
import { publicacionCacheService } from './PublicacionCacheService';

interface CarroStorage {
    items: CarroItem[];
    lastUpdated: string;
    usuarioId: number;
}

class LocalStorageCartService {
    private readonly STORAGE_KEY = 'carrito_usuario';

    private getStorageKey(): string {
        const userId = this.getCurrentUserId();
        return `${this.STORAGE_KEY}_${userId}`;
    }

    private getCurrentUserId(): number {
        const token = apiToken.getToken();
        if (!token) {
            return 0;
        }
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId || payload.id || 0;
        } catch {
            return 0;
        }
    }

    private getCarroStorage(): CarroStorage {
        try {
            const data = localStorage.getItem(this.getStorageKey());
            if (!data) {
                return this.createEmptyCart();
            }

            const parsed: CarroStorage = JSON.parse(data);

            return parsed;
        } catch (error) {
            console.error('Error reading cart from localStorage:', error);
            return this.createEmptyCart();
        }
    }

    private saveCarroStorage(data: CarroStorage): void {
        try {
            data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.getStorageKey(), JSON.stringify(data));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }

    private createEmptyCart(): CarroStorage {
        return {
            items: [],
            lastUpdated: new Date().toISOString(),
            usuarioId: this.getCurrentUserId()
        };
    }

    private getNextId(items: CarroItem[]): number {
        if (items.length === 0) return 1;
        return Math.max(...items.map(item => item.id)) + 1;
    }

    async getItemsCarro(): Promise<CarroItem[]> {
        const cart = this.getCarroStorage();
        return cart.items;
    }

    async getPublicacionesCarro(): Promise<Map<number, Publicacion>> {
        const cart = this.getCarroStorage();
        const publicacionIds = [...new Set(cart.items.map(item => item.publicacionId))];
        
        const result = new Map<number, Publicacion>();
        
        if (publicacionIds.length === 0) {
            return result;
        }

        const cachedPublicaciones = publicacionCacheService.getMultiple(publicacionIds);
        
        const missingIds: number[] = [];
        for (const id of publicacionIds) {
            if (cachedPublicaciones.has(id)) {
                result.set(id, cachedPublicaciones.get(id)!);
            } else {
                missingIds.push(id);
            }
        }

        if (missingIds.length > 0) {
            
            const fetchPromises = missingIds.map(async (id) => {
                try {
                    const publicacion = await apiCatalogo.getPublicacionById(id);
                    publicacionCacheService.set(id, publicacion);
                    return { id, publicacion };
                } catch (error) {
                    console.error(`Error obteniendo publicacion ${id}:`, error);
                    return { id, publicacion: null };
                }
            });

            const fetchedResults = await Promise.all(fetchPromises);
            
            fetchedResults.forEach(({ id, publicacion }) => {
                if (publicacion) {
                    result.set(id, publicacion);
                }
            });
        }

        return result;
    }

    async agregarProducto(publicacionId: number, cantidad: number): Promise<CarroResponse> {
        try {
            if (cantidad <= 0) {
                return {
                    exito: false,
                    mensaje: 'La cantidad debe ser mayor a 0',
                    tipo: 'error',
                    datos: null
                };
            }

            const cart = this.getCarroStorage();
            const existingItemIndex = cart.items.findIndex(item => item.publicacionId === publicacionId);

            if (existingItemIndex >= 0) {
                cart.items[existingItemIndex].cantidad += cantidad;
            } else {
                const newItem: CarroItem = {
                    id: this.getNextId(cart.items),
                    cantidad,
                    publicacionId,
                    usuarioId: this.getCurrentUserId()
                };
                cart.items.push(newItem);
            }

            this.saveCarroStorage(cart);

            return {
                exito: true,
                mensaje: 'Producto agregado al carrito',
                tipo: 'agregado',
                datos: { totalItems: cart.items.length }
            };

        } catch (error) {
            console.error('Error adding to cart:', error);
            return {
                exito: false,
                mensaje: 'Error al agregar al carrito',
                tipo: 'error',
                datos: null
            };
        }
    }

    async actualizarCantidad(publicacionId: number, cantidad: number): Promise<CarroResponse> {
        try {
            const cart = this.getCarroStorage();
            const itemIndex = cart.items.findIndex(item => item.publicacionId === publicacionId);

            if (itemIndex === -1) {
                return {
                    exito: false,
                    mensaje: 'Producto no encontrado en el carrito',
                    tipo: 'error',
                    datos: null
                };
            }
            let mensaje = '';
            let cantidadFinal = cantidad;
            if (cantidad <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                // Obtener la publicación para verificar stock disponible
                const publicacionesMap = await this.getPublicacionesCarro();
                const publicacion = publicacionesMap.get(publicacionId);
                cantidadFinal = cantidad;
                mensaje = 'Cantidad actualizada';
                
                if (publicacion && cantidad > publicacion.cantidad) {
                    cantidadFinal = publicacion.cantidad;
                    mensaje = `Cantidad ajustada al máximo disponible: ${publicacion.cantidad}`;
                }
                
                cart.items[itemIndex].cantidad = cantidadFinal;
            }

            this.saveCarroStorage(cart);

            return {
                exito: true,
                mensaje: cantidad > 0 ? mensaje : 'Producto eliminado',
                tipo: 'agregado',
                datos: cantidadFinal
            };

        } catch (error) {
            console.error('Error updating quantity:', error);
            return {
                exito: false,
                mensaje: 'Error al actualizar cantidad',
                tipo: 'error',
                datos: null
            };
        }
    }

    async eliminarProducto(publicacionId: number): Promise<void> {
        try {
            const cart = this.getCarroStorage();
            cart.items = cart.items.filter(item => item.publicacionId !== publicacionId);
            this.saveCarroStorage(cart);
        } catch (error) {
            console.error('Error removing product:', error);
            throw error;
        }
    }

    async vaciarCarrito(): Promise<void> {
        try {
            const emptyCart = this.createEmptyCart();
            this.saveCarroStorage(emptyCart);
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }

    async countItems(): Promise<number> {
        const cart = this.getCarroStorage();
        return cart.items.length;
    }

    async updatePublicacionData(publicacionId: number, publicacion: Publicacion): Promise<void> {
        publicacionCacheService.set(publicacionId, publicacion);
    }

    async refreshPublicaciones(): Promise<void> {
        const cart = this.getCarroStorage();
        const publicacionIds = [...new Set(cart.items.map(item => item.publicacionId))];
        
        if (publicacionIds.length > 0) {
            publicacionCacheService.refreshMultiple(publicacionIds);
        }
    }

    async reordenar(ordenId: string): Promise<CarroResponse> {
        try {
            const items = await apiOrdenes.reordenar(ordenId);


            const cart = this.getCarroStorage();
            cart.items = items.map((item, index) => ({
                ...item,
                id: index + 1,
                usuarioId: this.getCurrentUserId()
            }));
            this.saveCarroStorage(cart);
            return {
                exito: true,
                mensaje: 'Carrito actualizado con éxito',
                tipo: 'agregado',
                datos: { items }
            };
        } catch (error) {
            console.error('Error reordering:', error);
            throw error;
    }

    }


    clearUserCart(): void {
        try {
            localStorage.removeItem(this.getStorageKey());
        } catch (error) {
            console.error('Error clearing user cart:', error);
        }
    }
}

export const localStorageCartService = new LocalStorageCartService();