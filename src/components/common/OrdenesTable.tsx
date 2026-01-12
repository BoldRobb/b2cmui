
import { TableCell, TableRow, TableContainer, TableHead, Box, useColorScheme, Card, Stack, Typography, Select, MenuItem, CircularProgress, Table, TableBody, Alert } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import type { OrdenResponsePaginada, Orden } from "../../types/OrdenesInterface";
import { apiOrdenes } from "../../api/ApiOrdenes";
import { useOrdenesBase } from "../../hooks/useDocumentos";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { formatearFecha, formatearMoneda } from "../../types/DocumentosInterface";
import OrdenesModal, { type OrdenModalRef } from "../modals/OrdenesModal";

export default function OrdenesTable() {

const { mode } = useColorScheme();
const ordenModalRef = useRef<OrdenModalRef>(null);

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [datos, setDatos] = useState<OrdenResponsePaginada | null>(null);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState<string>('fecha');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [isManualSearch, setIsManualSearch] = useState(false);
    const [publicacionesError, setPublicacionesError] = useState<string | null>(null);

    const { data: ordenesBase, isLoading: loadingBase, error: errorBase, isError: isErrorBase } = useOrdenesBase();

    useEffect(() => {
        if (ordenesBase && !isManualSearch) {
            setDatos(ordenesBase);
        }
    }, [ordenesBase, isManualSearch]);

    useEffect(() => {
        if (errorBase && !isManualSearch) {
            const errorMessage = errorBase instanceof Error ? errorBase.message : 'Error desconocido';
            setPublicacionesError(errorMessage);
        }
    }, [errorBase, isManualSearch]);

    const fetchData = async (    page: number = currentPage, 
        size: number = pageSize,
        field: string = sortField,
        order: 'ASC' | 'DESC' = sortOrder) => {
        setIsManualSearch(true); // Marcar como búsqueda manual
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', (page - 1).toString());
            params.append('size', size.toString());
            params.append('sort', `${sortField},${sortOrder}`);
            const response = await apiOrdenes.getOrdenes({ page: page , size, sort: `${sortField},${sortOrder}` });
            setDatos(response);
            setCurrentPage(page);
            setPageSize(size);
            setSortField(field);
            setSortOrder(order);
            
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        } finally {
            setLoading(false);
        }

    }


  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchData( 1, newSize, sortField, sortOrder);
  };

  const handleSortChange = (field: string) => {
    const newOrder = sortField === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortField(field);
    setSortOrder(newOrder);
    fetchData(currentPage, pageSize, field, newOrder);
  };

  const handleOrdenClick = (orden: Orden) => {
    ordenModalRef.current?.showModal(orden);
  };

  return(

<>

  <Card
  sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          {isErrorBase && (<Alert severity="warning" sx={{ mb: 2 }}>
              
                Error al cargar órdenes: {publicacionesError}
              
          </Alert>
              
            )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-end" justifyContent="space-between">
            
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


        <TableContainer
        sx={{ position: 'relative', maxHeight: 'calc(10 * 70px + 66px)', overflow: 'auto' }}>
            { (loadingBase || loading) && (
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
                        <TableRow sx={{background:'background.default'}}>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem', width: '40%' }}>Folio</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem', width: '25%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => handleSortChange('fechaCreacion')}>
                                                Fecha
                                                {sortField === 'fechaCreacion' && (sortOrder === 'ASC' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem', width: '20%' }}>Estado</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem', width: '15%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => handleSortChange('total')}>
                                                Total
                                                {sortField === 'total' && (sortOrder === 'ASC' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
                              </Box>
                            </TableCell>

                        </TableRow>
                      </TableHead>
                        <TableBody>

                          {datos?.content.length === 0 && (!loading && !loadingBase) ? (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ py: 4, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                  No se encontraron documentos
                                </Typography>
                              </TableCell>

                            </TableRow>
                          ): (
                            datos?.content.map((orden) => {
                              return(
                              <>
                              <TableRow key={orden.id}
                                hover
                                onClick={() => handleOrdenClick(orden)}
                                sx={{
                                  backgroundColor: 'inherit',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    backgroundColor: 'action.hover',
                                  },
                                }}
                                >
                                  <TableCell
                                  sx={{ 
                                  fontSize: '0.875rem',
                                  borderBottom: '1.5px solid',
                                  borderColor: 'divider'}}>

                                    {orden.pedido.folio}
                                  </TableCell>
                                  <TableCell
                                  sx={{ 
                                  fontSize: '0.875rem',
                                  borderBottom: '1.5px solid',
                                  borderColor: 'divider'}}>
                                    {formatearFecha(orden.fecha_creacion)}
                                  </TableCell>
                                  <TableCell
                                  sx={{ 
                                  fontSize: '0.875rem',
                                  borderBottom: '1.5px solid',
                                  borderColor: 'divider'}}>
                                    {orden.estatus}
                                  </TableCell>
                                  <TableCell
                                  sx={{ 
                                  fontSize: '0.875rem',
                                  borderBottom: '1.5px solid',
                                  borderColor: 'divider'}}>
                                    {formatearMoneda(orden.total)}
                                    
                                  </TableCell>
                                </TableRow>
                              </>)
                                
                            })
                        )}


                        </TableBody>

                    
                </Table>
        </TableContainer>



  </Card>
  <OrdenesModal ref={ordenModalRef} />
    </>
  )

}