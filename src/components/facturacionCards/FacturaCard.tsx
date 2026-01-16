import { useNavigate, useSearchParams } from "react-router-dom";
import { useLogoUrl } from "../../hooks/useLogo";
import { useEffect, useState } from "react";
import type { FacturaModel } from "../../types/FacturacionInterface";
import { Box, Button, Card, CircularProgress, Typography, CardHeader, Avatar, IconButton, Grid, Stack, Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { apiDescargas } from "../../api/ApiDescargas";
import { notificationService } from "../../services/notificationService";
import { apiFacturacion } from "../../api/ApiFacturacion";
import { getRegimenFiscalDescripcion, getUsoCFDIDescripcion } from "../../types/FacturacionEnums";
import { formatearMoneda } from "../../types/DocumentosInterface";
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';




export default function FacturaCard() {
const [searchParams] = useSearchParams();
  const folio = searchParams.get('folio');
  const navigate = useNavigate();
  const { data: logourl } = useLogoUrl('fondo-claro');
  const [factura, setFactura] = useState<FacturaModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorCorreo, setErrorCorreo] = useState<string>('');
  const [correoEnviado, setCorreoEnviado] = useState<string>('');
    
  useEffect(() => {
    if (!folio) {
      notificationService.error('Error: No se proporcionó ningún folio de factura.');
      navigate('/facturacion');
      return;
    }
    fetchFactura(folio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folio, navigate]);

  const fetchFactura = async (folio: string) => {
    setLoading(true);
    try {

      const facturaData = await apiFacturacion.getFacturaByFolio(folio);

      setFactura(facturaData);
      
    } catch (error) {
      console.error('Error al obtener la factura:', error);
      notificationService.error(error instanceof Error ? error.message : 'Error desconocido al obtener la factura');
      navigate('/facturacion');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarXML = async () => {
    if (!factura) return;
    
    try {
       
       await apiDescargas.descargarYGuardarDocumentoPublico("ventas", factura.factura.id, factura.factura.folio, "XML");
      
    
      
    } catch (error) {
      console.error('Error al descargar XML:', error);
      
    }
  };

  const handleDescargarPDF = async () => {
    if (!factura) return;
    
    try {
     
       await apiDescargas.descargarYGuardarDocumentoPublico("ventas", factura.factura.id, factura.factura.folio, "PDF");
      
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      
    }
  };

  const obtenerDescripcionRegimenFiscal = (codigo: string): string => {
    const descripcion = getRegimenFiscalDescripcion(codigo);
    return descripcion !== 'No encontrado' ? descripcion : '';
  };

  const obtenerDescripcionUsoCFDI = (codigo: string): string => {
    const descripcion = getUsoCFDIDescripcion(codigo);
    return descripcion !== 'No encontrado' ? descripcion : '';
  };
  
    if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <CircularProgress size="large" />
      </div>
    );
  }

  if (!factura) {
    return (
      <Card sx={{ margin: '24px', textAlign: 'center' }}>
        <Typography variant="h4">Error</Typography>
        <Typography>No se pudo cargar la factura.</Typography>
        <Box sx={{ marginTop: '16px' }}>
          <Button variant="contained" onClick={() => navigate('/facturacion')}>
            Volver al inicio
          </Button>
        </Box>
      </Card>
    );
  }
  
  
  return(
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  padding: 2 }}>
          <Card sx={{width:'70%'}}>
              <Grid container >
                <Grid size={8} sx={{padding:2}}>
                    <Stack>
                        <Typography variant="h5" >{factura.empresa.razon_social}</Typography>
                        <Typography variant="subtitle1" >{factura.empresa.rfc}</Typography>
                        <Typography variant="subtitle1" >{factura.empresa.calle} {factura.empresa.numero_exterior}</Typography>
                        <Typography variant="subtitle1" >{factura.empresa.colonia} {factura.empresa.codigo_postal}</Typography>
                        <Typography variant="subtitle1" sx={{mb:2}}>{factura.empresa.ciudad}, {factura.empresa.estado}</Typography>
                        <Typography variant="subtitle1" sx={{mb:1, color:'primary.main'}}>{factura.factura.folio}</Typography>
                        <Typography variant="subtitle1" sx={{mb:1, fontWeight:'700'}}>Fecha: {factura.factura.fecha ? new Date(factura.factura.fecha).toLocaleDateString('es-MX') : 'N/A'}</Typography>
                        <Typography variant="subtitle1" sx={{mb:1, fontWeight:'700'}}>Moneda: {factura.factura.moneda?.claveMonedaSAT || 'MXN'}</Typography>
                    </Stack>
                    
                </Grid>
                <Grid size={4} sx={{padding:2, display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                  <img 
                  src={logourl} 
                  alt="Logo" 
                  style={{ 
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }} 
                />
                </Grid>
                
              </Grid>
              <Divider></Divider>
              <Grid container >
                <Grid size={6} sx={{padding:2}}>
                    <Stack>
                        <Typography variant="h5" sx={{mb:2}} >Datos del cliente</Typography>
                        <Typography variant="subtitle1" >{factura.regimenFiscal} - {obtenerDescripcionRegimenFiscal(factura.regimenFiscal)}</Typography>
                        <Typography variant="subtitle1" >{factura.usoCfdi} - {obtenerDescripcionUsoCFDI(factura.usoCfdi)}</Typography>
                        <Typography variant="subtitle1" >{factura.factura.cliente?.nombre}</Typography>
                        <Typography variant="subtitle1" >{factura.factura.cliente?.nombre_fiscal}</Typography>
                        <Typography variant="subtitle1" >{factura.factura.cliente?.rfc}</Typography>
                    </Stack>
                    
                </Grid>
                <Grid size={6} sx={{padding:2,}}>
                  <Typography variant="h5" sx={{mb: 2}}>Dirección</Typography>
                  <Typography variant="subtitle1" >{factura.factura.cliente.calle} {factura.factura.cliente.numero_exterior}</Typography>
                    <Typography variant="subtitle1" >{factura.factura.cliente.colonia} {factura.factura.cliente.codigo_postal}</Typography>
                    <Typography variant="subtitle1" >{factura.factura.cliente.ciudad}, {factura.factura.cliente.estado}</Typography>
                </Grid>
                
              </Grid>
              <Divider></Divider>
              {(()=>{

                const ROW_HEIGHT = 48; 
                const MAX_HEIGHT = 280; 
                const needsScroll = factura.factura?.partidas?.length ? factura.factura.partidas.length * ROW_HEIGHT > MAX_HEIGHT : false;
                return (
                    <TableContainer sx={{mb:'24px',maxHeight: needsScroll ? MAX_HEIGHT : 'auto'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                        Código
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                        Código SAT
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                        Descripción
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                        Cantidad
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                        Importe
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        <TableBody>
                            {factura.factura.partidas.map((partida, index) => (
                                <TableRow key={index} >
                                    <TableCell sx={{borderBottom:'1px solid lightgray'}}>{partida.articulo.clave}</TableCell>
                                    <TableCell sx={{borderBottom:'1px solid lightgray'}}>{partida.articulo.codigoSat}</TableCell>
                                    <TableCell sx={{borderBottom:'1px solid lightgray'}}>{partida.articulo.nombre}</TableCell>
                                    <TableCell sx={{borderBottom:'1px solid lightgray'}}>{partida.cantidad}</TableCell>
                                    <TableCell sx={{borderBottom:'1px solid lightgray'}}>{formatearMoneda(partida.importe)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                        
                    </TableContainer>
                )
            }

            )()}
            <Divider></Divider>
            <Box  sx={{paddingTop:2, px:2, pb:2}}>
            
            
                <Stack spacing={1} sx={{ alignItems: 'flex-end' }}>
                    <Box sx={{ display: 'flex', gap: 8 }}>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>Subtotal</Typography>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>{formatearMoneda(factura.factura.subtotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 8 }}>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>IEPS</Typography>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>{formatearMoneda(factura.factura.ieps)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 8 }}>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>IVA</Typography>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>{formatearMoneda(factura.factura.iva)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 8 }}>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>Total</Typography>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>{formatearMoneda(factura.factura.total)}</Typography>
                    </Box>
                </Stack>
            </Box>
            <Divider></Divider>
            <Box sx={{paddingTop:2, px:2, pb:2}}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" sx={{fontWeight:'600', backgroundColor:'warning.main', color:'white'}} startIcon={<InsertDriveFileOutlinedIcon /> } onClick={handleDescargarXML} >Descargar XML</Button>
                        <Button variant="outlined" sx={{fontWeight:'600', backgroundColor:'error.main', color:'white'}} startIcon={<PictureAsPdfOutlinedIcon />} onClick={handleDescargarPDF} >Descargar PDF</Button>
                    </Box>
            </Box>
          </Card>
        </Box>
    )
}
