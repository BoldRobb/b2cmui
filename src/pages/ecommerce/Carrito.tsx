import { useCallback, useEffect, useRef, useState } from "react";
import PageBg from "../../components/layout/PageBg";
import type { OrdenModalRef } from "../../components/modals/OrdenesModal";
import { useCartContext } from "../../context/CartContext";
import type { Orden } from "../../types/OrdenesInterface";
import { apiCarrito } from "../../api/ApiCarrito";
import { apiOrdenes } from "../../api/ApiOrdenes";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Card, CardHeader, Avatar, IconButton, Divider, Box, Stack, Modal } from "@mui/material";
import ProductItem from "../../components/products/ProductItem";
import { formatearMoneda } from "../../types/DocumentosInterface";
import OrdenesModal from "../../components/modals/OrdenesModal";

export default function CarritoPage(){
        const ordenModalRef =  useRef<OrdenModalRef>(null);
    const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);
    const [totalCarrito, setTotalCarrito] = useState<number>(0);
    const [subtotalCarrito, setSubtotalCarrito] = useState<number>(0);
    const [iva, setIva] = useState<number>(0);
    const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

        const {
        items,
        publicaciones,
        loading,
        count,
        clearCart,
        refreshCart,
        refreshCartPublicaciones,
    } = useCartContext();

    useEffect(() => {
        const fetchIva = async () => {
            try {
                const ivaValue = await apiCarrito.getIva();
                setIva(ivaValue);
            } catch (error) {
                console.error('Error al obtener el IVA:', error);
            }
        };

        fetchIva();
    }, [setIva]);

    useEffect(() => {
        if (selectedOrden && ordenModalRef.current) {
            ordenModalRef.current.showModal(selectedOrden);
        }
    }, [selectedOrden]);

    const getTotales = useCallback(async () => {
        setTotalCarrito(calcularTotal());
        setSubtotalCarrito(calcularSubtotal());
    }, [items]);

    useEffect(() => {
        getTotales();
    }, [getTotales]);
    useEffect(() => {
        refreshCartPublicaciones();
        refreshCart();
    }, [refreshCart, refreshCartPublicaciones]);
    const realizarOrden = async () => {
        try {
            const nuevaOrden = await apiOrdenes.createOrden(items);
            await clearCart();
            const OrdenApi = await apiOrdenes.getOrdenById(nuevaOrden.id.toString());
            setSelectedOrden(OrdenApi);

        } catch (error) {
            
            console.error('Error al crear la orden:', error);
            if(error instanceof Error) {
                setErrorMessage(error.message);
                setErrorModalOpen(true);
            }
        }
    }
    const calcularSubtotal = () => {
        return items.reduce((acc, item) => {
            const publicacion = publicaciones.get(item.publicacionId);
            if (publicacion) {
                return acc + (publicacion.precio * item.cantidad);
            }
            return acc;
        }, 0);
    };
    const calcularTotal = () => {
        const subtotal = calcularSubtotal();
        const impuesto = subtotal * iva;
        return subtotal + impuesto;
    }

    return(
        <PageBg>
            <Stack direction="row" justifyContent="space-between" spacing={10}>
            <Card
            sx={{width:'70%'}}>
                <CardHeader
                  title={<Typography variant="h3" sx={{fontWeight:'600'}}>Carrito</Typography>}
                  sx={{mb:'8px'}}
                />
                <Divider/>
                <Typography variant="h5" color="initial" sx={{mb:'16px', mt:'16px'}}>Productos ({count}):</Typography>
                <Divider/>
                {loading && <Typography variant="body1" color="initial" sx={{m:'16px'}}>Cargando productos del carrito...</Typography>}
                {!loading && items.length === 0 && <Typography variant="body1" color="initial" sx={{m:'16px'}}>El carrito está vacío.</Typography>}
                
                {!loading && items.map((item) => {
                    const publicacion = publicaciones.get(item.publicacionId);
                    if (!publicacion) return null;
                    return <ProductItem key={item.publicacionId} publicacion={publicacion} />;
                })}
            </Card>
            <Card
            sx={{width:'30%', height:'auto'}}>
                  <CardHeader
                  title={<Typography variant="h3" sx={{fontWeight:'600'}}>Resumen</Typography>}
                  sx={{mb:'8px'}}
                />
                <Divider/>
                <Typography variant="body1" color="initial" sx={{mb:'16px', mt:'16px'}}>({count} productos):</Typography>
                <Divider/>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2 }}>
                    <Typography variant="h5" color="initial">Subtotal:</Typography>
                    <Typography variant="h5" color="initial">{formatearMoneda(subtotalCarrito)}</Typography>
                </Box>
                <Divider/>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="h5" color="initial">Total:</Typography>
                    <Typography variant="h5" color="initial">{formatearMoneda(totalCarrito)}</Typography>
                </Box>
                <Button    
                variant="contained"
                color="primary"
                    size="large" 
                    fullWidth
                    disabled={items.length === 0 || loading}
                    onClick={() => {
                        if (items.length > 0) {
                            setConfirmModalOpen(true);
                        }
                    }}
                    sx={{mt: '2rem', position:'relative'}}
                >
                    Enviar pedido
                </Button>
                
            </Card>
            </Stack>
            
            <Dialog
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                sx: (theme) => ({
                    backgroundImage: 'radial-gradient(ellipse at 50% 01%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                    ...theme.applyStyles('dark', {
                        backgroundImage: 'radial-gradient(at 50% 1%, hsla(210, 100%, 16%, 0.24), hsla(225, 31%, 5%, 0.74))',
                    }),
                }),
            }}
            >
                <DialogTitle>¿Estás seguro de que deseas confirmar tu orden?</DialogTitle>
                <DialogContent>
                    <Typography>Esta acción creará una orden con los productos en tu carrito.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmModalOpen(false)} variant="outlined">
                        No
                    </Button>
                    <Button 
                        onClick={() => {
                            setConfirmModalOpen(false);
                            realizarOrden();
                        }} 
                        variant="contained"
                        color="primary"
                    >
                        Sí
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={errorModalOpen}
                onClose={() => setErrorModalOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                sx: (theme) => ({
                    backgroundImage: 'radial-gradient(ellipse at 50% 01%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                    ...theme.applyStyles('dark', {
                        backgroundImage: 'radial-gradient(at 50% 1%, hsla(210, 100%, 16%, 0.24), hsla(225, 31%, 5%, 0.74))',
                    }),
                }),
            }}
            >
                <DialogTitle>Error al crear la orden</DialogTitle>
                <DialogContent>
                    <Typography>{errorMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorModalOpen(false)} variant="contained">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
            <OrdenesModal ref={ordenModalRef} />
        </PageBg>
        
    )
}