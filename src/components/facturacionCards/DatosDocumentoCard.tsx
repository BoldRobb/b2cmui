import { Card, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { DatosDocumentoFacturable } from '../../types/FacturacionInterface';
import { formatearFecha, formatearMoneda } from '../../types/DocumentosInterface';

export interface DatosDocumentoProps{
    documento: DatosDocumentoFacturable
}

export default function DatosDocumentoCard({documento}: DatosDocumentoProps) {

    return(
        <Card>
            <Typography variant="subtitle1" sx={{py:0.5}}>Datos del documento</Typography>
            <Typography variant="body1" color='primary.main' sx={{fontWeight:'700', pb:0.5}}>{documento.folio}</Typography>
            <Typography variant="body1" sx={{pt:0.5, pb:1}}>Fecha: {formatearFecha(documento.fecha)}</Typography>
        
            <Divider/>


            {/* Partidas */}

            {(()=>{

                const ROW_HEIGHT = 48; 
                const MAX_HEIGHT = 350; 
                const needsScroll = documento?.partidas?.length ? documento?.partidas.length * ROW_HEIGHT > MAX_HEIGHT : false;
                return (
                    <TableContainer sx={{maxHeight: needsScroll ? MAX_HEIGHT : 'auto'}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                        Código
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
                            {documento.partidas.map((partida, index) => (
                                <TableRow key={index} >
                                    <TableCell sx={{borderBottom:'1px solid lightgray'}}>{partida.articulo.clave}</TableCell>
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

            {/* Totales */}
            <Grid container spacing={2} sx={{paddingTop:2, px:2}}>
                <Grid size={6}>
                    <Stack gap={1}>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>Subtotal</Typography>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>IEPS</Typography>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>IVA</Typography>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>Total</Typography>
                    </Stack>
                    
                </Grid>
                <Grid size={6}>
                    <Stack gap={1} alignItems="flex-end">
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>{formatearMoneda(documento.subtotal)}</Typography>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>{formatearMoneda(documento.ieps)}</Typography>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>{formatearMoneda(documento.iva)}</Typography>
                        <Typography variant="subtitle2" sx={{fontWeight:'600'}} color='primary.main'>{formatearMoneda(documento.total)}</Typography>
                    </Stack>
                </Grid>
            </Grid>

        
        </Card>
    )


}