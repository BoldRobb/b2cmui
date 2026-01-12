import type { Publicacion } from "./PedidosInterface";

export interface Categoria {
    id: string;
    nombre: string;
    listable: boolean;
    categorias_hijas: Categoria[];
}

export function getCategoriaDisplay(item: Publicacion, categorias: Categoria[]): string {
        if (!item.categoria) {
            return 'Sin categoría';
        }

        if (categorias && categorias.length > 0) {
            return convertirNombresCategorias(categorias, item.categoria) || item.categoria;
        }

        return item.categoria;
    }

export function findCategoriaById(categorias: Categoria[], categoriaId: string): Categoria | null {

    if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
        return null;
    }
    
    for (const categoria of categorias) {
        if (!categoria || typeof categoria.id !== 'string') {
            continue;
        }
        
        if (categoria.id === categoriaId) {
            return categoria;
        }
        
        if (categoria.categorias_hijas && Array.isArray(categoria.categorias_hijas)) {
            const categoriaEncontrada = findCategoriaById(categoria.categorias_hijas, categoriaId);
            if (categoriaEncontrada) {
                return categoriaEncontrada;
            }
        }
    }
    
    return null;
}

export function convertirNombresCategorias(categorias: Categoria[], pathCategoria: string): string | null {
    
    if (!pathCategoria || pathCategoria.trim() === '') {
        return null;
    }
    
    if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
        return pathCategoria; 
    }
    
    const parts = pathCategoria.split('/').filter(p => p.trim() !== ''); 
    const nombres: string[] = [];
    
    for (const p of parts) {
        const categoria = findCategoriaById(categorias, p.trim());
        if (!categoria) {
            nombres.push(p);
        } else {
            nombres.push(categoria.nombre);
        }
    }
    
    return nombres.join('/');
}