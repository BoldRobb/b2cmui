import { useEffect, useState } from "react";
import type { FilterValues } from "./FilterProducts";
import type { PublicacionResponsePaginada } from "../../types/PedidosInterface";
import { useCatalogoData } from "../../hooks/useCatalogo";
import { apiCatalogo } from "../../api/ApiCatalogo";
import { Card } from "@mui/material";




export default function ImageContainer(filtros: FilterValues ){
    
    
        const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentSort, setCurrentSort] = useState<string>('precio,desc');
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [publicaciones, setPublicaciones] = useState<PublicacionResponsePaginada>();
    const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
    const [isManualSearch, setIsManualSearch] = useState(false);
    const [publicacionesError, setPublicacionesError] = useState<string | null>(null);

    const { 
        error: errorBase,
        isError: isErrorBase
    } = useCatalogoData();


    useEffect(() => {
        if (errorBase && !isManualSearch) {
            const errorMessage = errorBase instanceof Error ? errorBase.message : 'Error desconocido';
            setPublicacionesError(errorMessage);
        }
    }, [errorBase, isManualSearch]);

    const handleSearchSubmit = () => {
        setIsManualSearch(true); // Marcar como búsqueda manual
        setLoading(true);
        fetchPublicaciones(1, pageSize, nombre, currentSort);
    }

    const fetchPublicaciones = async (
        page: number = currentPage, 
        size: number = pageSize, 
        searchNombre: string = nombre,
        sort: string = currentSort,
    ) => {
        try {
            setLoading(true);
            setPublicacionesError(null);
            const response = await apiCatalogo.getPublicaciones(searchNombre, filtros.precioMin, filtros.precioMax, filtros.categoria, filtros.disponibilidad, { 
                page: page, 
                size: size, 
                sort 
            });
            if(response){
            setCurrentPage(page);
            setPageSize(size);
            setPublicaciones(response);

            if (searchNombre !== nombre) {
                setNombre(searchNombre);
            } 
            }
            
            
        } catch (error) {
            console.error('Error fetching publicaciones:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setPublicacionesError(errorMessage);
            setPublicaciones(undefined);
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = async (page: number, size?: number) => {
        const newSize = size || pageSize;
        await fetchPublicaciones(page, newSize, nombre, currentSort);
    };


    return(
        <Card>
            
        </Card>
    )

}
