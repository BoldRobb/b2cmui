import { Box, Card, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useColorScheme } from "@mui/material";
import type { DocumentoDetallado } from "../../types/PedidosInterface";
import { formatearMoneda } from "../../types/DocumentosInterface";
import ImageContainer from "./ImageContainer";



interface DocumentoDetallesProps {
    documento: DocumentoDetallado;
}

export default function DocumentoDetalladoCard({ documento }: DocumentoDetallesProps){

    const { mode } = useColorScheme();

    
    return <Card
    
        sx={{backgroundColor: (mode === 'dark' ? 'hsla(210, 100%, 5%, 0.31) !important' : 'rgba(216, 216, 216, 0.34)'),}}
    >
        <TableContainer sx={{ position: 'relative', maxHeight: 'calc(4 *70px)', overflow: 'auto' }}>

        <Box
        sx={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (mode === 'dark' ? 'rgba(32, 32, 32, 0.5)' : 'rgba(247, 247, 247, 0.94)'),
              zIndex: 10,
            }}
        >


            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Producto</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }} align="center">Cantidad</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }} align="center">Precio</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }} align="center">Subtotal</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documento.partidas.length === 0? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron partidas en este documento.
                  </Typography>
                </TableCell>
              </TableRow>
            ) :(
                documento.partidas.map((partida) => (
                    <>
                    <TableRow
                    
                  hover
                  sx={{
                    backgroundColor: 'inherit',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}>

                    <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <ImageContainer publicacion={partida.publicacion} width={40} height={40}/>
                            <Typography variant="body1" sx={{ fontWeight: 500, marginLeft: '8px' }}>
                              {partida.articulo?.nombre || partida.publicacion?.titulo || 'Producto sin nombre'}
                            </Typography>  
                          </Box>  
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center' }}>
                            {partida.cantidad.toFixed(0)}
                          </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center' }}>
                            {formatearMoneda(partida.precio)}
                          </Typography> 
                          </Box>  
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.875rem', borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, textAlign: 'center' }}>
                              {formatearMoneda(partida.precio * partida.cantidad)}
                            </Typography>  
                          </Box>  
                    </TableCell>

                  </TableRow>
                  

                    </>
                   
                  
                
                ))
                
            
            )}
                </TableBody>
                
            </Table>
        </Box>

        </TableContainer>
        <Grid>
            <Grid container justifyContent="flex-end" sx={{ padding: '16px', paddingBottom:'8px' }}>
                <Typography variant="body1" sx={{ fontWeight: 700, mb: '0' }}>
                    Subtotal: {formatearMoneda(documento.importe)}
                </Typography>
            </Grid>
            <Grid container justifyContent="flex-end" sx={{ padding: '16px', paddingTop:'8px' }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    IVA: {formatearMoneda(documento.iva)}
                </Typography>
            </Grid>
            <Divider/>
            <Grid container justifyContent="flex-end" sx={{ padding: '16px' }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Total: {formatearMoneda(documento.total)}
                </Typography>
            </Grid>
        </Grid>
    </Card>
}