import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Stack,
  Pagination,
  Card,
  Select,
  MenuItem,
  TextField,
  Button,
  Tooltip,
  CircularProgress,
  useColorScheme,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useCargosBase, useMapaMonedas, useTiposOperacion } from "../../hooks/useDocumentos";
import { useEffect, useState } from "react";
import type { DocumentoResponse, DocumentosQueryParams } from "../../types/DocumentosInterface";
import { apiDocumentos } from "../../api/ApiDocumentos";
import { apiDescargas } from "../../api/ApiDescargas";
import { useDashboardData } from "../../hooks/useClienteData";
import { formatearFecha, formatearMoneda } from "../../types/DocumentosInterface";
import EmailModal from '../modals/EmailModal';
import { notificationService } from '../../services/notificationService';
import { apiCorreo } from '../../api/apiCorreo';



export default function AntiguedadTable(){
    const { mode } = useColorScheme();
    // Queries
    const {columnas, diasMaximos} = useDashboardData();
    const { data: cargosBase, isLoading: loadingCargosBase } = useCargosBase();
    const { data: tiposOperacionData } = useTiposOperacion();
    const { data: monedasData } = useMapaMonedas();
    //Estado local
    const [loading, setLoading] = useState(false);
    const [selectedDocumentos, setSelectedDocumentos] = useState<number[]>([]);
    const [accionSeleccionada, setAccionSeleccionada] = useState<'descargar' | 'email' | ''>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [folio, setFolio] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState<string>('fecha');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [isManualSearch, setIsManualSearch] = useState(false);
    const [mapaVencimientos, setMapaVencimientos] = useState<Record<number, Date>>({});
    // Email modal state
    const [emailOpen, setEmailOpen] = useState(false);
    const [emailTargetIds, setEmailTargetIds] = useState<number[]>([]);
    const [emailLoading, setEmailLoading] = useState(false);
    //Documentos
    const [documentos, setDocumentos] = useState<DocumentoResponse[]>(cargosBase?.content || []);
    const [totalPages, setTotalPages] = useState(cargosBase?.totalPages || 0);
    const [totalItems, setTotalItems] = useState(cargosBase?.totalElements || 0);


    // Sincronizar documentos base cuando se cargan
    useEffect(() => {
    if (cargosBase && !isManualSearch) {
        setDocumentos(cargosBase.content || []);
        setTotalPages(cargosBase.totalPages || 0);
        setTotalItems(cargosBase.totalElements || 0);
    }
    }, [cargosBase, isManualSearch]);

    useEffect(() => {
        if (documentos.length > 0) {
        conseguirMapaVencimientos(documentos);
        }
    }, [documentos]);

    const conseguirMapaVencimientos = async (documentos: DocumentoResponse[]) => {
        try {
            const mapa = await apiDocumentos.getMapaVencimientos(documentos);
            setMapaVencimientos(mapa);
        } catch (error) {
        console.error('Error al obtener mapa de vencimientos:', error);
        }
    };

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

        const response = await apiDocumentos.getCargos(searchFolio, queryParams);
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
        console.error(`Error al buscar cargos:`, error);
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocumentos(documentos.map((doc) => doc.id));
    } else {
      setSelectedDocumentos([]);
    }
  };

  const handleSelectDocumento = (id: number) => {
    setSelectedDocumentos((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

   const handleDescargarPDF = async (id: number, folio: string) => {
    try {

      await apiDescargas.descargarYGuardarDocumento('cargo', id, folio, 'PDF');
    } catch (error) {
      
      
      console.error('Error al descargar PDF:', error);
    }
  };

  const handleDescargarXML = async (id: number, folio: string) => {
    try {

      await apiDescargas.descargarYGuardarDocumento('cargo', id, folio,'XML');

    } catch (error) {
      
      
      console.error('Error al descargar XML:', error);
    }
  };

  const handleEnviarEmail = (id: number) => {
    setEmailTargetIds([id]);
    setEmailOpen(true);
  };

  const handleAccionMultiple = async (accion: 'descargar' | 'email') => {
      if (selectedDocumentos && selectedDocumentos.length > 0) {
        
        if (accion === 'descargar') {
        try {
          
          const documentosIds = selectedDocumentos.map(key => Number(key));
          await apiDescargas.descargarYGuardarComprimidos('cargo', documentosIds);
          
          setSelectedDocumentos([]);
        } catch (error) {
          
          console.error('Error al descargar documentos:', error);
        }
      }
        if (accion === 'email') {
          setEmailTargetIds(selectedDocumentos.map(key => Number(key)));
          setEmailOpen(true);
        }
        console.log('Acción múltiple:', accion, selectedDocumentos);
        setAccionSeleccionada('');
      }
    };

    const generarColumnasVencimientos = () => {
    if (!documentos.length || !documentos[0].vencimientos || !columnas) {
            return [];
        }

    const documento = documentos[0];
    const columnasVencimiento: Array<{tipo: string; dias: number | null; titulo: string}> = [];

    documento.vencimientos.forEach((vencimiento) => {
      if(vencimiento.tipo == 'ya_vencido'){
        if(vencimiento.dias != null){
            columnasVencimiento.push({
            tipo: vencimiento.tipo,
            dias: vencimiento.dias,
            titulo: `${columnas?.[vencimiento.tipo] || vencimiento.tipo} ${vencimiento.dias}`
          });
        }else{
          columnasVencimiento.push({
          tipo: vencimiento.tipo,
          dias: null,
          titulo: `Vencido +${diasMaximos?.[vencimiento.tipo] || 120}`
        });
        }
        
      }
    });
    return columnasVencimiento;
  };

  const getTipoOperacion = (tipoOperacionId: number): string => {
    if (!tiposOperacionData) return 'Desconocido';
    return tiposOperacionData[tipoOperacionId];
  };

  const columnasVencimientos = generarColumnasVencimientos();

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
              placeholder="Buscar por folio de factura"
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
            <Button variant="contained" onClick={() => handleBuscar(folio, currentPage, pageSize, sortField, sortOrder)} disabled={loadingCargosBase || loading}>
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

      {/* Header - Solo acciones múltiples */}
      {selectedDocumentos && selectedDocumentos.length > 0 && (
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} sx={{ p: 1.5, backgroundColor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {selectedDocumentos.length} documento{selectedDocumentos.length > 1 ? 's' : ''} seleccionado{selectedDocumentos.length > 1 ? 's' : ''}
            </Typography>
            <Select
              size="small"
              value={accionSeleccionada}
              onChange={(e) => setAccionSeleccionada(e.target.value as 'descargar' | 'email')}
              displayEmpty
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">Seleccionar acción</MenuItem>
              <MenuItem value="descargar">Descargar ZIP</MenuItem>
              <MenuItem value="email">Enviar por Email</MenuItem>
            </Select>
            <Button
              variant="outlined"
              size="small"
              disabled={!accionSeleccionada}
              onClick={() => handleAccionMultiple(accionSeleccionada as 'descargar' | 'email')}
            >
              Ejecutar
            </Button>
          </Stack>
        </Box>
      )}

      {/* Tabla */}
      <TableContainer sx={{ position: 'relative', maxHeight: 'calc(10 * 70px + 66px)', overflow: 'auto' }}>
        {(loadingCargosBase || loading) && (
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
              <TableCell padding="checkbox">
                <Checkbox
                  checked={documentos.length > 0 && selectedDocumentos && selectedDocumentos.length === documentos.length}
                  indeterminate={selectedDocumentos && selectedDocumentos.length > 0 && selectedDocumentos.length < documentos.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Operación</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => handleSortChange('folio')}>
                  Folio
                  {sortField === 'folio' && (sortOrder === 'ASC' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => handleSortChange('fecha')}>
                  Fecha
                  {sortField === 'fecha' && (sortOrder === 'ASC' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Vencimiento
              </TableCell>
              {columnasVencimientos.map((col) => (
                <TableCell key={`${col.tipo}_${col.dias}`} sx={{ fontWeight: 700, fontSize: '0.9rem' }} align="right">
                  {col.titulo}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }} align="right">
                No vencido
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }} align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, cursor: 'pointer' }} onClick={() => handleSortChange('total')}>
                  Saldo
                  {sortField === 'total' && (sortOrder === 'ASC' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />)}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Moneda
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }} align="center">
                Opciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentos.length === 0 && (!loadingCargosBase && !loading) ? (
              <TableRow>
                <TableCell colSpan={9 + columnasVencimientos.length} sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron documentos
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              documentos.map((documento) => (
                <TableRow
                  key={documento.id}
                  hover
                  sx={{
                    backgroundColor: selectedDocumentos?.includes(documento.id) ? 'action.selected' : 'inherit',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell padding="checkbox" sx={{ borderBottom: '1.5px solid',
                        borderColor: 'divider'}}>
                    <Checkbox
                      checked={selectedDocumentos?.includes(documento.id) ?? false}
                      onChange={() => handleSelectDocumento(documento.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1.5px solid',
                        borderColor: 'divider' }}>
                    {getTipoOperacion(documento.tipo_operacion_id)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500, borderBottom: '1.5px solid',
                        borderColor: 'divider' }}>{documento.folio}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1.5px solid',
                        borderColor: 'divider' }}>{formatearFecha(documento.fecha)}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1.5px solid',
                        borderColor: 'divider' }}>
                    {formatearFecha(mapaVencimientos[documento.id] ? mapaVencimientos[documento.id].toString() : documento.fecha)}
                  </TableCell>
                  {columnasVencimientos.map((col) => {
                    const vencimientoCorrespondiente = documento.vencimientos?.find(v => 
                      v.tipo === col.tipo && 
                      (col.dias != null ? v.dias === col.dias : v.dias == null)
                    );
                    return (
                      <TableCell key={`${col.tipo}_${col.dias}`} align="right" sx={{ fontSize: '0.875rem', borderBottom: '1.5px solid',
                        borderColor: 'divider' }}>
                        {vencimientoCorrespondiente ? formatearMoneda(vencimientoCorrespondiente.saldo) : '-'}
                      </TableCell>
                    );
                  })}
                  <TableCell align="right" sx={{ fontSize: '0.875rem', borderBottom: '1.5px solid',
                        borderColor: 'divider' }}>
                    {(() => {
                      const today = new Date();
                      const saldoVencido = documento.total - (documento.monto_aplicado || 0);
                      const fechaVencimientoRaw = mapaVencimientos[documento.id];
                      
                      if (!fechaVencimientoRaw) {
                        const fechaDocumento = new Date(documento.fecha);
                        return today.getTime() > fechaDocumento.getTime() ? '-' : formatearMoneda(saldoVencido);
                      }
                      
                      const fechaVencimiento = fechaVencimientoRaw instanceof Date 
                        ? fechaVencimientoRaw 
                        : new Date(fechaVencimientoRaw);
                      
                      const estaVencido = today.getTime() > fechaVencimiento.getTime();
                      return estaVencido ? '-' : formatearMoneda(saldoVencido);
                    })()}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.875rem', fontWeight: 600, borderBottom: '1.5px solid',
                        borderColor: 'divider' }}>
                    {formatearMoneda(documento.total)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1.5px solid',
                        borderColor: 'divider' }}>
                    {monedasData?.[documento.moneda_id] || '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: '1.5px solid',
                        borderColor: 'divider' }}>
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="Descargar PDF">
                        <IconButton
                          size="small"
                          onClick={() => handleDescargarPDF(documento.id, documento.folio)}
                          sx={{
                            color: 'error.main',
                            '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' },
                          }}
                        >
                          <PictureAsPdfIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar XML">
                        <IconButton
                          size="small"
                          onClick={() => handleDescargarXML(documento.id, documento.folio)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': { backgroundColor: 'rgba(25, 103, 210, 0.08)' },
                          }}
                        >
                          <InsertDriveFileIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Enviar por Email">
                        <IconButton
                          size="small"
                          onClick={() => handleEnviarEmail(documento.id)}
                          sx={{
                            color: 'success.main',
                            '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.08)' },
                          }}
                        >
                          <EmailIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <EmailModal
        open={emailOpen}
        onClose={() => { setEmailOpen(false); setEmailTargetIds([]); }}
        selectedFolios={documentos.filter(d => emailTargetIds.includes(d.id)).map(d => d.folio)}
        loading={emailLoading}
        onSend={async (datos) => {
          if (emailTargetIds.length === 0) return;
          const loadingKey = notificationService.loading('Enviando correo...');
          try {
            setEmailLoading(true);
            await apiCorreo.sendEmail(datos, emailTargetIds, 'cargo');
            notificationService.close(loadingKey);
            notificationService.success('Correo enviado correctamente');
            setEmailOpen(false);
            setEmailTargetIds([]);
          } catch (error) {
            notificationService.close(loadingKey);
            notificationService.error(String(error));
          } finally {
            setEmailLoading(false);
          }
        }}
      />
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