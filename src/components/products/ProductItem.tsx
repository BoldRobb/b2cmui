import { Box, Paper, Stack, Typography, useColorScheme } from "@mui/material";
import type { Publicacion } from "../../types/PedidosInterface";
import ImageContainer from "../common/ImageContainer";
import CartActions from "./CartActions";
import { formatearMoneda } from "../../types/DocumentosInterface";
import { useCatalogoData } from "../../hooks/useCatalogo";
import { convertirNombresCategorias, getCategoriaDisplay, type Categoria } from "../../types/CategoriasInterface";

interface ProductItemProps {
    publicacion: Publicacion;
}

export default function ProductItem(props: ProductItemProps) {
    
    const {mode} = useColorScheme();
    const {
        categorias
    } = useCatalogoData();



    return(
        <Box sx={{
            width:'100%',
            borderRadius: 1,
            '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            }
        }}>
            <Stack direction="row" spacing={2} sx={{padding:2, alignItems:'center'}}>
                {/* Columna 1: Imagen */}
                <Box sx={{flexShrink: 0}}>
                    <ImageContainer publicacion={props.publicacion} width={120} height={120}/>
                </Box>
                
                {/* Columna 2: Información del producto */}
                <Box sx={{flexGrow: 1}}>
                    <Stack direction="column">
                        <Typography variant="h6">{props.publicacion.titulo}</Typography>
                        <Typography variant="subtitle1">{formatearMoneda(props.publicacion.precio)}</Typography>
                        <Typography variant="subtitle2">
                            Categoría: <Typography component="span" variant="subtitle2" color="primary">{getCategoriaDisplay(props.publicacion, categorias || [])}</Typography>
                        </Typography>
                    </Stack>
                </Box>
                
                {/* Columna 3: Acciones del carrito */}
                <Box sx={{flexShrink: 0}}>
                    <Paper 
                        elevation={1}
                        sx={{
                            marginBottom: 1,
                            padding: '8px 12px',
                            backgroundColor: props.publicacion.cantidad < 0 
                                ? (mode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : '#e8f5e9')
                                : (mode === 'dark' ? 'rgba(255, 8, 8, 0.2)' : '#ffe0e0'),
                            
                            mb: '8px',
                        }}
                    >
                        <Typography variant="body1" sx={{ 
                            color: props.publicacion.cantidad < 0 
                                ? (mode === 'dark' ? '#81c784' : '#2e7d32')
                                : (mode === 'dark' ? '#c70000' : '#e60000'), 
                            fontWeight: 600 
                        }}>
                            {props.publicacion.cantidad < 0 ? `${props.publicacion.cantidad.toFixed(2)} en existencia` : 'No hay existencias'}
                        </Typography>
                    </Paper>
                    <CartActions publicacionId={props.publicacion.id}
                        isInCart={true}
                        size="default"
                        currentQuantity={5}
                        loading={false}
                        isWorking={true}
                        onAddToCart={async (publicacionId: number, cantidad: number) => {}}
                        onUpdateQuantity={async (publicacionId: number, cantidad: number) => {}}
                        onRemoveFromCart={async (publicacionId: number) => {}}
                    />
                </Box>
            </Stack>
        </Box>
    )
}