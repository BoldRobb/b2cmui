import { useEffect, useState } from "react";
import { useCatalogoData } from "../../hooks/useCatalogo";
import type { Categoria } from "../../types/CategoriasInterface";
import { Box, Button, Card, Divider, IconButton, MenuItem, Select, Stack, Switch, TextField, Typography, useColorScheme } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';

export interface FilterValues {
    categoria: string;
    precioMin: number | null;
    precioMax: number | null;
    disponibilidad: boolean | null;
}

interface FilterProductsProps {
    onFilterChange?: (filters: FilterValues) => void;
    onSearch?: (filters: FilterValues) => void;
    onClear?: () => void;
}

export default function FilterProducts({ onFilterChange, onSearch, onClear }: FilterProductsProps){

    const {mode} = useColorScheme();

    const [selectedCategoria, setSelectedCategoria] = useState<string>('');
    const [categorias, setCategorias] = useState<Categoria[]>([]); 
    const [selectCategoriaValue, setSelectCategoriaValue] = useState<string>('');
    const [precioMin, setPrecioMin] = useState<number | null>(null);
    const [precioMax, setPrecioMax] = useState<number | null>(null);
    const [disponibilidad, setDisponibilidad] = useState<boolean | null >(null);
 
    const { 
        categorias: categoriasBase,
        isLoading: loadingBase,
        isError: isErrorBase
    } = useCatalogoData();

    // Sincronizar datos base con estado local
    useEffect(() => {
        if (categoriasBase) {
            setCategorias(categoriasBase);
        }
    }, [categoriasBase]);

    const handleSearch = () => {
        const filterValues = {
            categoria: selectedCategoria,
            precioMin,
            precioMax,
            disponibilidad
        };
        
        if (onFilterChange) {
            onFilterChange(filterValues);
        }
        
        if (onSearch) {
            onSearch(filterValues);
        }
    };

    const handleClear = () => {
        setSelectCategoriaValue('');
        setSelectedCategoria('');
        setPrecioMin(null);
        setPrecioMax(null);
        setDisponibilidad(null);
        
        const filterValues = {
            categoria: '',
            precioMin: null,
            precioMax: null,
            disponibilidad: null
        };
        
        if (onFilterChange) {
            onFilterChange(filterValues);
        }
        
        if (onClear) {
            onClear();
        }
    };

    const buildCategoriaOptions = (categorias: Categoria[], level: number = 0, parentPath: string = ''): any[] => {
        const options: any[] = [];
        
        categorias.forEach(categoria => {
            const currentPath = parentPath ? `${parentPath}/${categoria.id}` : categoria.id.toString();
            
            options.push({
                value: currentPath,
                label: categoria.nombre,
                level: level,
                disabled: false
            });
            
            if (categoria.categorias_hijas && categoria.categorias_hijas.length > 0) {
                const childOptions = buildCategoriaOptions(categoria.categorias_hijas, level + 1, currentPath);
                options.push(...childOptions);
            }
        });
        
        return options;
    };
        const getCategoriaOptions = () => {
        if (loadingBase || categorias.length === 0) {
            return [];
        }
        
        return [
            { value: '', label: 'Todas las categorías', level: 0, disabled: false },
            ...buildCategoriaOptions(categorias)
        ];
    };

    return(
        <Card  sx={{backgroundColor: (mode === 'dark' ? 'hsla(210, 100%, 5%, 0.31) !important' : 'rgba(216, 216, 216, 0.34)'),}}>
            
            <Stack direction={"column"} spacing={2}>
                
                    <Typography variant="h5">Filtros</Typography>
                    <Divider/>
                    <Box>
                        <Typography variant="h6">Categoría</Typography>
                        <Select
                        fullWidth
                        disabled={isErrorBase || loadingBase}
                        value={selectCategoriaValue}
                        endAdornment={
                            selectCategoriaValue ? (
                                <InputAdornment position="end" sx={{ marginRight: 2 }}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectCategoriaValue('');
                                            setSelectedCategoria('');
                                        }}
                                        edge="end"
                                        sx={{border:'none'}}
                                    >
                                        <ClearIcon fontSize="inherit" sx={{ color: 'inherit', border: 'none' }} />
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        }
                        onChange={(event) => {
                                    const value = event.target.value;
                                    console.log("Valor seleccionado (ruta completa):", value);
                                    setSelectedCategoria(value);
                                    setSelectCategoriaValue(value || '');
                                    
                                    if (onFilterChange) {
                                        onFilterChange({
                                            categoria: value,
                                            precioMin,
                                            precioMax,
                                            disponibilidad
                                        });
                                    }
                                }}
                        displayEmpty
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    maxHeight: 300,
                                }
                            }
                        }}
                        >
                            {getCategoriaOptions().map((option, index) => (
                                <MenuItem 
                                    key={option.value === '' ? 'all-categories' : `${option.value}-${index}`} 
                                    value={option.value}
                                    disabled={option.disabled}
                                    sx={{ paddingLeft: `${(option.level || 0) * 2}rem`,
                                        fontWeight: option.value === '' ? 'bold' : 'normal',
                                        overflowY: 'auto'
                                 }}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                    
                    <Divider/>
                    <Box>
                        <Typography variant="h6">Precio</Typography>
                        <TextField type="number"
                        placeholder="Precio mín" 
                        slotProps={{
                            input: {
                                startAdornment: (
                                <InputAdornment position="start">
                                    $
                                </InputAdornment>
                                ),
                            },
                        }}
                        disabled={isErrorBase || loadingBase}
                        onChange={(value) => setPrecioMin(value.target.value as unknown as number)}
                        />
                        
                        <TextField type="number"
                        placeholder="Precio máx"
                        slotProps={{
                            input: {
                                startAdornment: (
                                <InputAdornment position="start">
                                    $
                                </InputAdornment>
                                ),
                            },
                        }} 
                        disabled={isErrorBase || loadingBase}
                        onChange={(value) => setPrecioMax(value.target.value as unknown as number)}
                        />
                    </Box>
                    <Divider/>
                    <Box>
                        <Typography variant="h6">Disponibilidad</Typography>
                        <Switch
                        disabled={isErrorBase || loadingBase}
                        onChange={(event) => setDisponibilidad(event.target.checked)}
                        defaultChecked={false}
                        >
                            
                        </Switch>
                    </Box>
                    <Divider/>
                    <Box>
                        <Button variant="outlined" sx={{marginRight:2}} color="primary" onClick={handleClear}>
                            Limpiar
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSearch}>
                            Buscar
                        </Button>
                    </Box>
            </Stack>
        </Card>
    )
}