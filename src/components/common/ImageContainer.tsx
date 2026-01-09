import { Paper, useColorScheme } from "@mui/material";
import { useImage } from "../../hooks/useProductImages";
import type { Publicacion } from "../../types/PedidosInterface";
import ImageIcon from '@mui/icons-material/Image';

interface ProductImageProps {
    publicacion: Publicacion;
    numero?: number;
    width?: number;
    height?: number;
    preview?: boolean;
}

export default function ImageContainer( {
    publicacion,
    numero = 0,
    width = 200,
    height = 200,
}: ProductImageProps) {
    const {mode} = useColorScheme();
    const { imageUrl, isLoading } = useImage(
        publicacion?.id, 
        publicacion?.imagenes?.[numero]
    );
    if (!publicacion || !publicacion.imagenes || publicacion.imagenes.length === 0) {
        return (
            <div
                style={{
                    width: width,
                    height: height,
                    backgroundColor: (mode === 'dark' ? 'rgba(32, 32, 32, 0.5)' : 'rgba(247, 247, 247, 0.94)'),
                    border: '1px solid',
                    borderColor: (mode === 'dark' ? '#444444ff' : '#d9d9d9ff'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                }}
            >
                <ImageIcon style={{ fontSize: '24px' }} />
            </div>
        );
    }
    if (isLoading || !imageUrl) {
        return (
            <div
                style={{
                    width: width,
                    height: height,
                    backgroundColor: (mode === 'dark' ? 'rgba(32, 32, 32, 0.5)' : 'rgba(247, 247, 247, 0.94)'),
                    border: '1px solid',
                    borderColor: (mode === 'dark' ? '#444444ff' : '#d9d9d9ff'),
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                }}
            >
                <ImageIcon style={{ fontSize: '24px' }} />
            </div>
        );
    }

    return (
        <Paper>
            <img src={imageUrl} alt={publicacion.titulo ||  'Producto'} 
            width={width} height={height} 
            style={{ borderRadius: '6px', objectFit: 'cover', border: '1px solid'
                , borderColor: (mode === 'dark' ? '#444444ff' : '#d9d9d9ff')
             }}
            
            />

        </Paper >
        
    );

}