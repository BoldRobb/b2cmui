
import PageBg from "../../components/layout/PageBg";
import FilterProducts, { type FilterValues } from "../../components/products/FilterProducts";
import Box from "@mui/material/Box";
import ProductList from "../../components/products/ProductList";
import { useState, useCallback } from "react";
import Stack from "@mui/material/Stack";



export default function CatalogoPage(){

    const [filters, setFilters] = useState<FilterValues>({
        categoria: '',
        precioMin: null,
        precioMax: null,
        disponibilidad: null,
    });

    const handleFilterChange = useCallback((filters: FilterValues) => {
        setFilters(filters);
        console.log("Filtros actualizados:", filters);
    }, []);

    return(
        <PageBg>
            <Stack direction={"row"} spacing={10} justifyContent="space-between">
                <Box width='30%'>
              
           <FilterProducts
                onFilterChange={handleFilterChange}>

           </FilterProducts>
           
            </Box>
            <Box width='70%'>
            
            <ProductList {...filters}></ProductList>
            </Box>
            </Stack>
        </PageBg>
    )

}