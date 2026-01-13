import { Box, Button, TextField, Typography, useColorScheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCartContext } from "../../context/CartContext";
interface CarritoActionsProps {
    publicacionId: number;
    size?: 'small' | 'default' | 'large'; 
    layout?: 'horizontal' | 'vertical';
    deleteOnly?: boolean; 
    showCantidad?: boolean;
}

export default function CartActions({
    publicacionId,
    size = 'small',
    layout = 'vertical',
    deleteOnly = false,
    showCantidad = true,}
: CarritoActionsProps) {

    const {mode} = useColorScheme();
    const { isInCart, getItemQuantity, loading, addToCart, updateQuantity, removeFromCart } = useCartContext();
    const [localQuantity, setLocalQuantity] = useState(getItemQuantity(publicacionId));
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        console.log("Cantidad en carrito actualizada:", getItemQuantity(publicacionId));
        setLocalQuantity(getItemQuantity(publicacionId));
        
    }, [getItemQuantity, publicacionId]);

    useEffect(() => {
        // Limpiar el timer cuando el componente se desmonte
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleQuantityChange = (value: number | null) => {
        const newQuantity = value || 1;
        setLocalQuantity(newQuantity);
        
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        debounceTimerRef.current = setTimeout(async () => {
            const result = await updateQuantity(publicacionId, newQuantity);
            if (typeof result === 'number') {
                setLocalQuantity(result);
            }
        }, 400);
    };


    const handleAddToCart = async () => {
        setLocalQuantity(1);
        await addToCart(publicacionId, 1);
    };

    const handleRemoveFromCart = async () => {
        await removeFromCart(publicacionId);
    };
    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };
    const buttonSize = size === 'large' ? 'large' : size === 'default' ? 'medium' : 'small';
    const inputWidth = size === 'large' ? 80 : size === 'default' ? 70 : 60;
    const inputFontSize = size === 'large' ? 16 : size === 'default' ? 14 : 12;
    


if (!isInCart || localQuantity === 0) {
    return(
        <div onClick={handleContainerClick}>
            <Button
            size={buttonSize}
            variant="outlined"
            onClick={handleAddToCart}
            loading={loading}
            startIcon={<ShoppingCartIcon />}
            sx={mode === 'dark' ? {
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(0, 113, 189, 0.15)',
                },
                ...(size === 'large' && { minWidth: '160px', height: '48px' })
            } : {
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(0, 113, 189, 0.1)',
                },
                ...(size === 'large' && { minWidth: '160px', height: '48px' })
            }}
            >
                Agregar al carrito
            </Button>
        </div>
    )
}
const renderContent = (
    <>
    <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: size === 'large' ? '16px' : '12px',
                marginBottom: size === 'large' ? '12px' : '8px'
            }}>
                <Typography variant={size === 'large' ? 'h6' : 'body1'} color="text">
                    {showCantidad ? "Cantidad:": ""}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    
                    <TextField type="number" 
                    inputMode="numeric" 
                    size={size === 'large' ? 'medium' : 'small'}
                    sx={{width: inputWidth}}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    value={localQuantity}
                    disabled={loading}
                    
                    />
                </Box>
            
            <Box>
                <Button
                   variant="outlined" 
                   startIcon={<DeleteIcon />}
                   onClick={handleRemoveFromCart}
                   size={buttonSize}
                   loading={loading}
                   sx={mode === 'dark' ? {

                       borderColor: 'error.main',
                       color: 'error.light',
                       '&:hover': {
                           borderColor: 'error.main',
                           backgroundColor: 'rgba(255, 0, 0, 0.15)',
                       }, padding: 1,
                   } : {
                          borderColor: 'error.main',
                          color: 'error.main',
                          '&:hover': {
                              borderColor: 'error.main',
                              backgroundColor: 'rgba(255, 0, 0, 0.04)',
                          },
                          padding: 1,
                   }}
                >
                     {deleteOnly ? "" : (size === 'large' ? "Eliminar del carrito" : "Eliminar")}
                </Button>
            </Box>
            </div>
    </>
);
return (
        <div onClick={handleContainerClick}>
            {layout === 'vertical' ? (
                <Box  sx={{ alignItems: 'flex-start', width: '100%' }}>
                    {renderContent}
                </Box>
            ) : (
                <Box  sx={{ alignItems: 'center' }}>
                    {renderContent}
                </Box>
            )}
        </div>
    );

}