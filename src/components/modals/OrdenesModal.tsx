import { useNavigate } from "react-router-dom";
import type { Orden } from "../../types/OrdenesInterface";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import type { Publicacion } from "../../types/PedidosInterface";
import { useCartContext } from "../../context/CartContext";
import { apiOrdenes } from "../../api/ApiOrdenes";
import { OrdenesPublicacionesCache } from "../../services/documentosCacheService";
import { notificationService } from "../../services/notificationService";
import { Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, useColorScheme } from "@mui/material";
import { formatearFecha, formatearMoneda } from "../../types/DocumentosInterface";
import ImageContainer from "../common/ImageContainer";

export interface OrdenModalRef {
    showModal: (orden: Orden) => void;
}

const OrdenesModal = forwardRef<OrdenModalRef>((_, ref) => {
    const { mode } = useColorScheme();
    const navigate = useNavigate();
    const { reordenar } = useCartContext();
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orden, setOrden] = useState<Orden | null>(null);
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
    const currentOrdenRef = useRef<Orden | null>(null);

    useImperativeHandle(ref, () => ({
        showModal: async (ordenToShow: Orden) => {
            setOrden(ordenToShow);
            currentOrdenRef.current = ordenToShow;
            setIsVisible(true);

            const cachedPublicaciones = OrdenesPublicacionesCache.get(ordenToShow.id);
            
            if (cachedPublicaciones) {
                setPublicaciones(cachedPublicaciones);
                setLoading(false);
            } else {
                setLoading(true);
                try {
                    const publicacionesData = await apiOrdenes.getPublicacionesByOrdenId(ordenToShow.id.toString());
                    setPublicaciones(publicacionesData);
                    OrdenesPublicacionesCache.set(ordenToShow.id, publicacionesData);
                } catch (error) {
                    console.error('Error al cargar publicaciones:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
    }));

    const handleOk = async () => {
        if (!orden) return;
        
        try {
            await reordenar(orden.id.toString());
            setIsVisible(false);
            navigate('/app/carrito');
        } catch (error) {
            console.error('Error al reordenar:', error);
            notificationService.error('Error al reordenar');
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    }

    return(
        
        <Dialog
        open={isVisible}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: (theme) => ({
                    backgroundImage: 'radial-gradient(ellipse at 50% 01%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                    ...theme.applyStyles('dark', {
                        backgroundImage: 'radial-gradient(at 50% 1%, hsla(210, 100%, 16%, 0.24), hsla(225, 31%, 5%, 0.74))',
                    }),
                }),
            }}
            >

            {orden ?(
                <>
                
                <DialogTitle>Orden: {orden.id_externo}</DialogTitle>
                <DialogContent>
                    <Stack gap={2} sx={{ mt: 1 }}>
                        {/* Card con información resumida */}
                        <Card
                            sx={{
                                backgroundColor: (mode === 'dark' ? 'hsla(210, 100%, 5%, 0.31)' : 'rgba(216, 216, 216, 0.34)'),
                                p: 2
                            }}
                        >
                            <Grid container spacing={12}>
                                <Grid >
                                    <Typography variant="caption" color="text.secondary">Folio</Typography>
                                    <Typography variant="body2" fontWeight={600}>{orden.pedido.folio}</Typography>
                                </Grid>
                                <Grid >
                                    <Typography variant="caption" color="text.secondary">Fecha</Typography>
                                    <Typography variant="body2" fontWeight={600}>{formatearFecha(orden.fecha_creacion)}</Typography>
                                </Grid>
                                <Grid >
                                    <Typography variant="caption" color="text.secondary">Estado:</Typography>
                                    <Typography variant="body2" fontWeight={600}>{orden.estatus}</Typography>
                                </Grid>
                                <Grid >
                                    <Typography variant="caption" color="text.secondary">Total:</Typography>
                                    <Typography variant="body2" fontWeight={600}>{formatearMoneda(orden.total)}</Typography>
                                </Grid>
                            </Grid>
                        </Card>
                        <Divider sx={{ my: 2 }} />
                        {/* Productos de la Orden */}
                        <Card
                            sx={{
                                backgroundColor: (mode === 'dark' ? 'hsla(210, 100%, 5%, 0.31)' : 'rgba(216, 216, 216, 0.34)'),
                                p: 2,
                                

                            }}
                        >
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Productos de la Orden
                            </Typography>
                            
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <Box sx={{ 
                                        maxHeight: '300px', 
                                        overflow: 'auto',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1
                                    }}>
                                        <Table size="small" stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700 }}>Cantidad</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Precio Unitario</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                    {publicaciones.map((pub) => {
                                                const detalle = orden?.detalles?.find(d => d.publicacion_id === pub.id);
                                                const cantidad = detalle?.cantidad || pub.cantidad || 0;
                                                const subtotal = pub.precio * cantidad;
                                                
                                                return (
                                                <TableRow key={pub.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <ImageContainer  publicacion={pub} width={48} height={48}/>
                                                            <Typography variant="body2">{pub.descripcion}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">{cantidad}</TableCell>
                                                    <TableCell align="right">{formatearMoneda(pub.precio)}</TableCell>
                                                    <TableCell align="right">{formatearMoneda(subtotal)}</TableCell>
                                                </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                    </Box>
                                    
                                    <Divider sx={{ my: 2 }} />
                                    
                                    <Stack spacing={1} alignItems="flex-end">
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', minWidth: 200 }}>
                                            <Typography variant="body2">Subtotal</Typography>
                                            <Typography variant="body2" fontWeight={600}>{formatearMoneda(
                                                publicaciones.reduce((total, pub) => {
                                                    const detalle = orden?.detalles?.find(d => d.publicacion_id === pub.id);
                                                    const cantidad = detalle?.cantidad || pub.cantidad || 0;
                                                    return total + (pub.precio * cantidad);
                                                }, 0)
                                            )}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', minWidth: 200 }}>
                                            <Typography variant="body1" fontWeight={700}>Total</Typography>
                                            <Typography variant="body1" fontWeight={700}>{formatearMoneda(orden.total)}</Typography>
                                        </Box>
                                    </Stack>
                                </>
                            )}
                        </Card>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} variant="outlined">
                        Cerrar
                    </Button>
                    <Button onClick={handleOk} variant="contained">
                        Pedir de nuevo
                    </Button>
                </DialogActions>
                </>
                
        
        
        ):(
                <DialogTitle>Orden: 'N/A'</DialogTitle>
            )}



        </Dialog>
    );
});

OrdenesModal.displayName = 'OrdenesModal';

export default OrdenesModal;