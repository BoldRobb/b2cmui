
import PageBg from "../../components/layout/PageBg";
import CartActions from "../../components/products/CartActions";
import ProductItem from "../../components/products/ProductItem";
import FilterProducts, { type FilterValues } from "../../components/products/FilterProducts";
import Box from "@mui/material/Box";
import ProductList from "../../components/products/ProductList";
import { useState, useCallback } from "react";



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
            <Box width='30%'>
              
           <FilterProducts
                onFilterChange={handleFilterChange}>

           </FilterProducts>
           <ProductList {...filters} ></ProductList>
            </Box>
        </PageBg>
    )

}