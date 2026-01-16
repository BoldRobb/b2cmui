import { forwardRef, useImperativeHandle, useState, useMemo, useCallback } from "react";
import { useCartContext } from "../../context/CartContext";
import { useArticuloData } from "../../hooks/useCatalogo";
import { Box, CircularProgress, Dialog, Divider, ImageList, ImageListItem, Paper, Stack, Tab, Tabs, Typography, useColorScheme } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import InventoryIcon from '@mui/icons-material/Inventory';
import ImageContainer from "../common/ImageContainer";
import { formatearMoneda } from "../../types/DocumentosInterface";
import { getCategoriaDisplay } from "../../types/CategoriasInterface";
import CartActions from "../common/CartActions";
import StorageIcon from '@mui/icons-material/Storage';
import ImageCarouselContainer from "../common/ImageCarouselContainer";

export interface ArticuloModalRef {
    showModal: (publicacionId: number) => void;
}


const ArticuloModal = forwardRef<ArticuloModalRef>((_,ref) => {

    const {mode} = useColorScheme();

    const [publicacionId, setPublicacionId] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);

    const {
        publicacion,
        existencias,
        categorias,
        isLoading,
        isError
    } = useArticuloData(publicacionId ?? 0);

    const renderExistencias = () => {
        return (
            <Box sx={{ py: 1 }}>
                <Box sx={{ width: '100%', maxHeight: '50vh', overflowY: 'auto' }}>
                    {existencias && existencias.length > 0 ? (
                        <Paper
                            variant="outlined"
                            sx={{
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    bgcolor: 'action.hover',
                                    p: 1.5,
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    fontWeight: 'bold',
                                    color: 'text.secondary'
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    Almacén
                                </Box>
                                <Box sx={{ flex: '0 0 120px', textAlign: 'center' }}>
                                    Existencias
                                </Box>
                            </Box>

                            {existencias.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        px: 2.5,
                                        minHeight: '72px',
                                        borderBottom: index < existencias.length - 1 ? 1 : 0,
                                        borderColor: 'divider',
                                        bgcolor: 'background.paper',
                                        transition: 'background-color 0.2s ease',
                                        cursor: 'default',
                                        '&:hover': {
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flex: '0 0 60px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                bgcolor: item.cantidad_existencia > 0 ? '#77e1fc' : '#f8d49d',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <StorageIcon
                                                sx={{
                                                    fontSize: 16,
                                                    color: item.cantidad_existencia > 0 ? 'primary.main' : 'warning.main'
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ mb: 0.25 }}>
                                            {item.nombre_almacen || `Almacén ${index + 1}`}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            flex: '0 0 120px',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                            {item.cantidad_existencia}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            unidades
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Paper>
                    ) : (
                        <Paper
                            variant="outlined"
                            sx={{
                                textAlign: 'center',
                                py: 7.5,
                                px: 2.5,
                                bgcolor: 'action.hover',
                                borderRadius: 3,
                                borderStyle: 'dashed',
                                borderWidth: 2
                            }}
                        >
                            <StorageIcon
                                sx={{
                                    fontSize: 48,
                                    color: 'text.disabled',
                                    mb: 2
                                }}
                            />
                            <Typography variant="h5" color="text.disabled" sx={{ mb: 1 }}>
                                No hay información de existencias
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                No se encontraron datos de existencias por almacén para este producto
                            </Typography>
                        </Paper>
                    )}
                </Box>
            </Box>
        );
    };
    interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

    function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    }
    useImperativeHandle(ref, () => ({
        showModal: (id: number) => {
            setPublicacionId(id);
            setIsVisible(true);
        }
    }));

return(
    <Dialog open={isVisible} onClose={() => { setIsVisible(false); setCurrentTab(0); }} maxWidth="md" fullWidth
    PaperProps={{
                sx: (theme) => ({
                    backgroundImage: 'radial-gradient(ellipse at 50% 01%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                    ...theme.applyStyles('dark', {
                        backgroundImage: 'radial-gradient(at 50% 1%, hsla(210, 100%, 16%, 0.24), hsla(225, 31%, 5%, 0.74))',
                    }),
                }),
            }} >
        {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
                <CircularProgress size={60} />
            </Box>
        ) : publicacion ? (
        <Box
        sx={{padding: '1rem'}}
        >
        <Tabs value={currentTab} onChange={handleTabChange} 
        sx={{ justifyContent:'center', borderBottom: 1, borderColor: 'divider' }}
        variant="fullWidth"
        >
            <Tab icon={<InfoIcon sx={{color:'primary.main'}}/>} iconPosition="start" label={<Typography variant="h4" sx={{color: 'primary.main'}}>Información</Typography>} value={0} ></Tab>
            <Tab icon={<InventoryIcon sx={{color:'primary.main'}} />} iconPosition="start" label={<Typography variant="h4" sx={{color: 'primary.main'}}>Existencias</Typography>} value={1}></Tab>
        </Tabs>

        <CustomTabPanel  value={currentTab} index={0}>
        <Stack direction="row" spacing={2} sx={{mb:2}}>
                <Box sx={{width: 420, height: 480, minWidth: 420, overflowY: 'auto'}}>
            <ImageList cols={1}>
                {publicacion?.imagenes && publicacion.imagenes.length > 1 ? (
                    <ImageCarouselContainer publicacion={publicacion} width={400} height={400}></ImageCarouselContainer>
                ) : (
                    <ImageListItem>
                       {publicacion &&(<ImageContainer publicacion={publicacion} numero={0} width={400} height={400}></ImageContainer>)} 
                    </ImageListItem>
                )}
                
                
            </ImageList>
        </Box>
        <Box sx={{paddingTop: 1, width: 500}}>
            <Typography variant="h2" >{publicacion?.titulo}</Typography>
            <Typography variant="h4" color="initial">{formatearMoneda(publicacion?.precio || 0)} </Typography>
            <Paper 
                        sx={{
                            marginBottom: 1,
                            padding: '8px 12px',
                            border: '1px solid',
                            borderColor: publicacion.cantidad > 0 
                                ? (mode === 'dark' ? '#2e7d32' : '#2e7d32')
                                : (mode === 'dark' ? '#e60000' : '#e60000'),
                            backgroundColor: publicacion.cantidad > 0 
                                ? (mode === 'dark' ? 'rgba(38, 219, 78, 0.18)' : '#e8f5e9')
                                : (mode === 'dark' ? 'rgba(211, 36, 36, 0.2)' : '#ffe0e0'),
                            mt:'8px',
                            mb: '8px',
                        }}
                    >
                        <Typography variant="body1" sx={{ 
                            color: publicacion.cantidad > 0 
                                ? (mode === 'dark' ? '#2e7d32' : '#2e7d32')
                                : (mode === 'dark' ? '#e60000' : '#e60000'), 
                            fontWeight: 600 
                        }}>
                            {publicacion.cantidad > 0 ? `${publicacion.cantidad.toFixed(2)} en existencia` : 'No hay existencias'}
                        </Typography>
                    </Paper>
            <Typography variant="h5" sx={{mt:2}}>Descripción</Typography>
            <Typography variant="body1" sx={{mt:1, whiteSpace: 'pre-line'}}>{publicacion?.descripcion || 'Sin descripción disponible.'}</Typography>
            <Typography variant="h5"  sx={{mt:2}}> Información del producto</Typography>
            <Paper
            sx={{
                            marginBottom: 1,
                            padding: '8px 12px',
                            border: '1px solid',
                            borderColor: (mode === 'dark' ? '#74a2ce' : '#91caff'),
                            backgroundColor: (mode === 'dark' ? 'hsla(210, 100%, 28%, 0.24)' : '#e6f4ff'),
                            color: (mode === 'dark' ? '#74a2ce' : '#0958d9'),
                            mt:'8px',
                            mb: '8px',
                        }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {getCategoriaDisplay(publicacion, categorias || [])}
                </Typography>
            </Paper>
            <Divider sx={{mt: '1rem', mb:'1rem'}}/>
            <Typography variant="h5" color="initial" sx={{mt:'8px', mb:'12px'}}>Agregar al carrito</Typography>
            {publicacion.cantidad > 0 ? (
            <CartActions 
            publicacionId={publicacion.id} 
            size="large"
            ></CartActions> ):(
                <Paper
            sx={{
                            marginBottom: 1,
                            padding: '8px 12px',
                            border: '1px solid',
                            borderColor: (mode === 'dark' ? '#e60000' : '#e60000'),
                            backgroundColor: (mode === 'dark' ? 'rgba(211, 36, 36, 0.2)' : '#ffe0e0'),
                            color: (mode === 'dark' ? '#e60000' : '#e60000'),
                            mt:'8px',
                            mb: '8px',
                        }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Este producto no tiene existencias disponibles
                </Typography>
            </Paper>
            )}
        
        </Box>
            </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={currentTab} index={1}>
            {renderExistencias()}
        </CustomTabPanel>
        </Box>
        ):(
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem' }}>
                <Typography variant="h4" color="error">Error al cargar el artículo.</Typography>
            </Box>
        )}
        
    </Dialog>
)



})




export default ArticuloModal;