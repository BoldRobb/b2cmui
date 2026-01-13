import { Box, Paper, Stack, Typography, useColorScheme } from "@mui/material";
import type { Publicacion } from "../../types/PedidosInterface";
import ImageContainer from "../common/ImageContainer";
import CartActions from "../common/CartActions";
import { formatearMoneda } from "../../types/DocumentosInterface";
import { useCatalogoData } from "../../hooks/useCatalogo";
import { convertirNombresCategorias, getCategoriaDisplay, type Categoria } from "../../types/CategoriasInterface";
import { useCartContext } from "../../context/CartContext";

interface ProductItemProps {
    publicacion: Publicacion;
    onClick?: () => void;
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
            borderBottom: '1px solid',
            borderColor: 'divider',
            cursor: props.onClick ? 'pointer' : 'default',
            '&:hover': {
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            }
        }}
        onClick={props.onClick}
        >
            <Stack direction="row" spacing={2} sx={{padding:2, alignItems:'center'}}>
                {/* Columna 1: Imagen */}
                <Box sx={{flexShrink: 0}}>
                    <ImageContainer publicacion={props.publicacion} width={100} height={100}/>
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
                        sx={{
                            marginBottom: 1,
                            padding: '8px 12px',
                            border: '1px solid',
                            borderColor: props.publicacion.cantidad > 0 
                                ? (mode === 'dark' ? '#2e7d32' : '#2e7d32')
                                : (mode === 'dark' ? '#e60000' : '#e60000'),
                            backgroundColor: props.publicacion.cantidad > 0 
                                ? (mode === 'dark' ? 'rgba(38, 219, 78, 0.18)' : '#e8f5e9')
                                : (mode === 'dark' ? 'rgba(211, 36, 36, 0.2)' : '#ffe0e0'),
                            
                            mb: '8px',
                        }}
                    >
                        <Typography variant="body1" sx={{ 
                            color: props.publicacion.cantidad > 0 
                                ? (mode === 'dark' ? '#2e7d32' : '#2e7d32')
                                : (mode === 'dark' ? '#e60000' : '#e60000'), 
                            fontWeight: 600 
                        }}>
                            {props.publicacion.cantidad > 0 ? `${props.publicacion.cantidad.toFixed(2)} en existencia` : 'No hay existencias'}
                        </Typography>
                    </Paper>
                    {props.publicacion.cantidad > 0 && (
                    <CartActions
                        publicacionId={props.publicacion.id}
                        size="default"
                    />)}
                    
                </Box>
            </Stack>
        </Box>
    )
}