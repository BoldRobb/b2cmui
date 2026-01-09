
import {useEffect, useState} from 'react';
import { formatearFecha, formatearMoneda, type DocumentoResponse, type DocumentosQueryParams } from '../../types/DocumentosInterface';
import { apiPedidos } from '../../api/ApiPedidos';
import { apiCotizaciones } from '../../api/apiCotizaciones';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Box, Button, Card, CircularProgress, Collapse, MenuItem, Pagination, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useColorScheme } from '@mui/material';
import { useDocumentosBase } from '../../hooks/useDocumentos';
import { useDocumentosDetallados } from '../../hooks/useDocumentosDetallados';
import DocumentoDetalladoCard from './DocumentoDetalladoCard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export type TipoDocumento = 'pedidos' | 'cotizaciones';
export type Documento = DocumentoResponse;

interface DocumentoDetalladoTableProps{
    tipo: TipoDocumento;
}

 const getConfiguracionTipo = (tipo: TipoDocumento) => {
    const configuraciones = {
      'pedidos': {
        titulo: 'Pedidos',
        placeholder: 'Buscar por folio de pedido',
        searchMethod: apiPedidos.getPedidos.bind(apiPedidos),
        getDetailById: apiPedidos.getDocumentoDetallado.bind(apiPedidos),
        fechaLabel: 'Fecha del pedido',
      },
      'cotizaciones': {
        titulo: 'Cotizaciones',
        placeholder: 'Buscar por folio de cotización',
        searchMethod: apiCotizaciones.getCotizaciones.bind(apiCotizaciones),
        getDetailById: apiCotizaciones.getCotizacionById.bind(apiCotizaciones),
        fechaLabel: 'Fecha de cotización',
      },

    };
    
    return configuraciones[tipo];
  };

  const getCacheKeyTipo = (tipo: TipoDocumento) => {
    const cacheKeys = {
      'pedidos': 'pedidos_detallados_cache',
        'cotizaciones': 'cotizaciones_detalladas_cache',
    };
    return cacheKeys[tipo];
  }




export default function DocumentosDetalladosTable({ tipo }: DocumentoDetalladoTableProps) {

      const config = getConfiguracionTipo(tipo);
      const { mode } = useColorScheme();

    const [loading, setLoading] = useState<boolean>(false);
    const [folio, setFolio] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortField, setSortField] = useState<string>('fecha');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [isManualSearch, setIsManualSearch] = useState(false);

    const { data: documentosBase, isLoading: isLoadingBase } = useDocumentosBase(tipo);

      const [documentos, setDocumentos] = useState<Documento[]>(documentosBase?.content || []);
      const [totalPages, setTotalPages] = useState(documentosBase?.totalPages || 0);
      const [totalItems, setTotalItems] = useState(documentosBase?.totalElements || 0);

    const {
        toggleDetalles,
        resetExpanded,
        isExpanded,
        isLoading,
        getDetalle
    } = useDocumentosDetallados(getCacheKeyTipo(tipo));


    
    // Sincronizar documentos base cuando se cargan
    useEffect(() => {
    if (documentosBase && !isManualSearch) {
        setDocumentos(documentosBase.content || []);
        setTotalPages(documentosBase.totalPages || 0);
        setTotalItems(documentosBase.totalElements || 0);
    }
    }, [documentosBase, isManualSearch]);

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);


        const handleBuscar = async (
        searchFolio: string = folio,
        page: number = currentPage,
        size: number = pageSize,
        field: string = sortField,
        order: 'ASC' | 'DESC' = sortOrder
        ) => {
        setIsManualSearch(true);
        setLoading(true);
        try{
            const queryParams: DocumentosQueryParams = {
                page: page,
                size: size,
                sort: `${field},${order}`,
            };

            const response = await config.searchMethod(searchFolio, queryParams);
            setDocumentos(response.content);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalElements);
            setCurrentPage(page);
            setPageSize(size);
            setSortField(field);

            setSortOrder(order);
            if (searchFolio !== null) {
                setFolio(searchFolio);
            }
                


        }catch (error) {
            console.error(`Error al buscar ${tipo}:`, error);
            setDocumentos([]);
        } finally {
            
            setLoading(false);
            
        }
        };


    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        handleBuscar(folio, value, pageSize, sortField, sortOrder);
    };  

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1);
        handleBuscar(folio, 1, newSize, sortField, sortOrder);
    };

    const handleSortChange = (field: string) => {
        const newOrder = sortField === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
        setSortField(field);
        setSortOrder(newOrder);
        handleBuscar(folio, currentPage, pageSize, field, newOrder);
    };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        {/* Barra de búsqueda y selector de tamaño */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-end" justifyContent="space-between">
          <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
            <TextField
              placeholder={config.placeholder}
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleBuscar(folio, currentPage, pageSize, sortField, sortOrder);
              }}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 250 }}
            />
            <Button variant="contained" onClick={() => handleBuscar(folio, currentPage, pageSize, sortField, sortOrder)} disabled={isLoadingBase || loading}>
              Buscar
            </Button>
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              Mostrar:
            </Typography>
            <Select
              size="small"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              sx={{ minWidth: 80 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </Box>
        </Stack>
      </Box>

      {/* Tabla */}
      <TableContainer sx={{ position: 'relative', maxHeight: 'calc(10 * 75px + 66px)', overflow: 'auto' }}>
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
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.default' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => handleSortChange('fecha')}>
                  {config.fechaLabel}
                  {sortField === 'fecha' && (sortOrder === 'ASC' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => handleSortChange('folio')}>
                  Folio
                  {sortField === 'folio' && (sortOrder === 'ASC' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
                </Box>
              </TableCell>
              
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => handleSortChange('total')}>
                  Monto total
                  {sortField === 'total' && (sortOrder === 'ASC' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem', alignItems: 'center' }}>Estatus</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem', alignItems: 'center' }}>Detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentos.length === 0 && ( !isLoadingBase && !loading ) ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron documentos
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              documentos.map((documento) => {
                const detalle = getDetalle(documento.id);
                return (
                  <>
                    <TableRow
                      key={documento.id}
                      hover
                      sx={{
                        
                        backgroundColor: 'inherit',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                    <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1.5px solid',
                        borderColor: 'divider', }}>{formatearFecha(documento.fecha)}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500, borderBottom: '1.5px solid',
                        borderColor: 'divider', }}>{documento.folio}</TableCell>
                      <TableCell  sx={{ fontSize: '0.875rem', fontWeight: 600, borderBottom: '1.5px solid',
                        borderColor: 'divider', }}>
                        {formatearMoneda(documento.total)}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1.5px solid',
                        borderColor: 'divider', }}>
                        {documento.estatus}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1.5px solid',
                        borderColor: 'divider', }}>
                        <Button
                          variant="text"
                          sx={{color:'primary.main', fontSize: '0.875rem'}}
                          onClick={() => toggleDetalles(documento.id, async (id: string) => {
                            return await config.getDetailById(id);
                          })}
                          startIcon={isExpanded(documento.id) ? <VisibilityOffIcon sx={{ color: 'primary.main' }} /> : <VisibilityIcon sx={{ color: 'primary.main' }} />}
                        >
                            <Typography sx={{color:'primary.main'}}>{isExpanded(documento.id) ? 'Ocultar Detalles' : 'Mostrar Detalles'}</Typography>
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded(documento.id) && (
                      <TableRow key={`${documento.id}-details`}>
                        <TableCell colSpan={5} sx={{ py: 0, borderBottom: 'none' }}>
                          <Collapse in={isExpanded(documento.id)} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2 }}>
                              {isLoading(documento.id) ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                  <CircularProgress size={30} />
                                </Box>
                              ) : detalle ? (
                                <DocumentoDetalladoCard documento={detalle} />
                              ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                  No se pudieron cargar los detalles
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {documentos.length > 0 ? `${startItem}-${endItem} de ${totalItems} documentos` : 'Sin documentos'}
        </Typography>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
        )}
      </Box>
    </Card>
  );

}