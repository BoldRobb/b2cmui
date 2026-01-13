import { useEffect, useState, useRef } from "react";
import type { FilterValues } from "./FilterProducts";
import type { PublicacionResponsePaginada } from "../../types/PedidosInterface";
import { useCatalogoData } from "../../hooks/useCatalogo";
import { apiCatalogo } from "../../api/ApiCatalogo";
import { Box, Button, Card, CircularProgress, Divider, List, MenuItem, Select, Stack, TextField, Typography, useColorScheme } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ProductItem from "./ProductItem";
import ArticuloModal, { type ArticuloModalRef } from "../modals/ArticuloModal";



export default function ProductList(filtros: FilterValues ){
    
    const {mode} = useColorScheme();
    const modalRef = useRef<ArticuloModalRef>(null);
      const { 
        error: errorBase,
        publicaciones: publicacionesBase,
        isError: isErrorBase,
        isLoading: isLoadingBase,
    } = useCatalogoData();
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentSort, setCurrentSort] = useState<string>('precio,desc');
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [publicaciones, setPublicaciones] = useState<PublicacionResponsePaginada | undefined>(publicacionesBase);
    const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
    const [isManualSearch, setIsManualSearch] = useState(false);
    const [publicacionesError, setPublicacionesError] = useState<string | null>(null);

    const handleOpenArticulo = (publicacionId: number) => {
        modalRef.current?.showModal(publicacionId);
    };

  


    useEffect(() => {
        if (errorBase && !isManualSearch) {
            const errorMessage = errorBase instanceof Error ? errorBase.message : 'Error desconocido';
            setPublicacionesError(errorMessage);
        }
    }, [errorBase, isManualSearch]);
    useEffect(() => {
        if (publicacionesBase && !isManualSearch) {
            
            setPublicaciones(publicacionesBase);
        }
    }, [publicacionesBase, isManualSearch]);

    // Efecto para aplicar filtros cuando cambian
    useEffect(() => {
        if (filtros.categoria || filtros.precioMin !== null || filtros.precioMax !== null || filtros.disponibilidad !== null) {
            setIsManualSearch(true);
            fetchPublicaciones(1, pageSize, nombre, currentSort);
        } else if (isManualSearch && !filtros.categoria && filtros.precioMin === null && filtros.precioMax === null && filtros.disponibilidad === null) {
            // Si se limpian todos los filtros, volver a mostrar publicaciones base
            setIsManualSearch(false);
            setPublicaciones(publicacionesBase);
        }
    }, [filtros.categoria, filtros.precioMin, filtros.precioMax, filtros.disponibilidad]);

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
        <Card
        sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
        >
            
    <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        {/* Barra de búsqueda y selector de tamaño */}
        <Stack direction='column' spacing={1}  justifyContent="space-between">
            <Typography variant="h4" color="initial">Buscar productos</Typography>
            <Divider/>
          <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
            <TextField
              placeholder="Buscar por nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit();
              }}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 250 }}
            />
            <Button variant="contained" onClick={handleSearchSubmit} disabled={ loading}>
              Buscar
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              Mostrar:
            </Typography>
            <Select
              size="small"
              value={pageSize}
              onChange={(e) => handlePageChange(1, Number(e.target.value))}
              sx={{ minWidth: 80 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem  value={100}>100</MenuItem>
            </Select>
          </Box>
          </Stack>
          
        </Stack>

    </Box>

              <List
              >
                 { (isLoadingBase || loading) && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: (mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'),
                              zIndex: 10,
                            }}
                          >
                            <CircularProgress />
                          </Box>
                        )}
                {  publicaciones?.content.length === 0 && !(isLoadingBase || loading) ? (
                    <Typography variant="body1" sx={{ p: 2 }}>
                        No se encontraron productos.
                    </Typography>
                    
                ) : (
                    publicaciones?.content.map((publicacion) => (
                        <ProductItem 
                            publicacion={publicacion} 
                            key={publicacion.id} 
                            onClick={() => handleOpenArticulo(publicacion.id)}
                        />
                    ))
                )}
              </List>

              <ArticuloModal ref={modalRef} />
        </Card>
    )

}
