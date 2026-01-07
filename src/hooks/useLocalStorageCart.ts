import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { localStorageCartService } from '@/services/LocalStorageCartService';
import type { CarroItem, CarroResponse } from '@/types/CarritoInterface';
import type { Publicacion } from '@/types/PedidosInterface';
import { apiToken } from '@/api/ApiToken';


interface UseCartReturn {
  // Estados
  items: CarroItem[];
  publicaciones: Map<number, Publicacion>;
  loading: boolean;
  count: number;
  isWorking: boolean;
  
  // Acciones
  addToCart: (publicacionId: number, cantidad: number) => Promise<void>;
  updateQuantity: (publicacionId: number, cantidad: number) => Promise<unknown>;
  removeFromCart: (publicacionId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  reordenar: (ordenId: string) => Promise<void>;
  
  // Utilidades
  getItemQuantity: (publicacionId: number) => number;
  isInCart: (publicacionId: number) => boolean;
  updatePublicacionData: (publicacionId: number, publicacion: Publicacion) => Promise<void>;
  refreshCartPublicaciones: () => Promise<void>;

}

export const useLocalStorageCart = (): UseCartReturn => {
  const [items, setItems] = useState<CarroItem[]>([]);
  const [publicaciones, setPublicaciones] = useState<Map<number, Publicacion>>(new Map());
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [isWorking, setIsWorking] = useState(true);

  const triggerUpdate = useCallback(() => {
  }, []);
 
  const loadCartData = useCallback(async () => {
    if (!apiToken.isAuthenticated() || apiToken.isAdmin()) {

      setItems([]);
      setPublicaciones(new Map());
    setCount(0);
      setIsWorking(false);
      return;
    }

    setLoading(true);
    try {

      const [itemsData, publicacionesData, countData] = await Promise.all([
        localStorageCartService.getItemsCarro(),
        localStorageCartService.getPublicacionesCarro(), 
        localStorageCartService.countItems(),

      ]);



      setItems(itemsData);
      setPublicaciones(publicacionesData);
      setCount(countData);

      setIsWorking(true);


      triggerUpdate();

    } catch (error) {
      console.error('LocalStorage Cart - Error loading cart:', error);
      setIsWorking(false);
    } finally {
      setLoading(false);
    }
  }, [triggerUpdate]);

  const addToCart = useCallback(async (publicacionId: number, cantidad: number) => {
    try {
      setLoading(true);
      const response: CarroResponse = await localStorageCartService.agregarProducto(publicacionId, cantidad);
      
      if (response.exito) {
        message.success(response.mensaje);
        await loadCartData(); 
      } else {
        message.warning(response.mensaje);
      }
    } catch (error) {
      console.error('LocalStorage Cart - Error adding to cart:', error);
      message.error('Error al agregar al carrito');
    } finally {
      setLoading(false);
    }
  }, [loadCartData]);

  const updateQuantity = useCallback(async (publicacionId: number, cantidad: number) => {
    
    try {
      setLoading(true);
      const response: CarroResponse = await localStorageCartService.actualizarCantidad(publicacionId, cantidad);
      
      if (response.exito) {
        message.success(response.mensaje);
        await loadCartData();
        return response.datos;
      } else {
        message.warning(response.mensaje);
        await loadCartData();
      }
    } catch (error) {
      console.error('LocalStorage Cart - Error updating quantity:', error);
      message.error('Error al actualizar cantidad');
    } finally {
      setLoading(false);
    }
  }, [loadCartData]);


  const removeFromCart = useCallback(async (publicacionId: number) => {
    try {
      setLoading(true);
      await localStorageCartService.eliminarProducto(publicacionId);
      message.success('Producto eliminado del carrito');
      await loadCartData();
    } catch (error) {
      console.error('LocalStorage Cart - Error removing from cart:', error);
      message.error('Error al eliminar del carrito');
    } finally {
      setLoading(false);
    }
  }, [loadCartData]);

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      await localStorageCartService.vaciarCarrito();
      setItems([]);
      setPublicaciones(new Map());
      setCount(0);

      message.success('Carrito vaciado');
      await loadCartData();
    } catch (error) {
      console.error('LocalStorage Cart - Error clearing cart:', error);
      message.error('Error al vaciar carrito');
    } finally {
      setLoading(false);
    }
  }, [loadCartData]);
  
  const refreshCart = useCallback(async () => {
    await loadCartData();
  }, [loadCartData]);

  const getItemQuantity = useCallback((publicacionId: number): number => {
    const item = items.find(item => item.publicacionId === publicacionId);
    return item ? item.cantidad : 0;
  }, [items]);

  const isInCart = useCallback((publicacionId: number): boolean => {
    return items.some(item => item.publicacionId === publicacionId);
  }, [items]);


  const updatePublicacionData = useCallback(async (publicacionId: number, publicacion: Publicacion) => {
    try {
      await localStorageCartService.updatePublicacionData(publicacionId, publicacion);

      setPublicaciones(prev => {
        const newMap = new Map(prev);
        newMap.set(publicacionId, publicacion);
        return newMap;
      });
    } catch (error) {
      console.error('LocalStorage Cart - Error updating publicacion data:', error);
    }
  }, []);

  const refreshCartPublicaciones = useCallback(async () => {
    try {
      await localStorageCartService.refreshPublicaciones();

      await loadCartData();
    } catch (error) {
      console.error('LocalStorage Cart - Error refreshing publicaciones:', error);
    }
  }, [loadCartData]);

  const reordenar = useCallback(async (ordenId: string): Promise<void> => {
    try {
      setLoading(true);
      const response: CarroResponse = await localStorageCartService.reordenar(ordenId);
      if (response.exito) {
        message.success('Productos añadidos con éxito');
        await loadCartData();
      }

    } catch (error) {
      console.error('LocalStorage Cart - Error reordering:', error);
      message.error('Error al reordenar');
    } finally {
      setLoading(false);
    }

}, [loadCartData]);

  useEffect(() => {
    if (apiToken.isAuthenticated()) {
      loadCartData();
    } else {
      setItems([]);
      setPublicaciones(new Map());
      setCount(0);
      setIsWorking(false);
    }
  }, [loadCartData]);


  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.startsWith('b2c_carrito_usuario_')) {
        loadCartData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadCartData]);

  return {
    // Estados
    items,
    publicaciones,
    loading,
    count,
    isWorking,
    
    // Acciones
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    reordenar,
    
    // Utilidades
    getItemQuantity,
    isInCart,
    updatePublicacionData,
    refreshCartPublicaciones,

  };
};