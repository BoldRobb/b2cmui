import { Container } from "@mui/material";
import ConfiguracionFacturacionCard from "../../components/configuracion/ConfiguracionFacturacionCard";
import PageBg from "../../components/layout/PageBg";
import DocumentosHeader from "../../components/common/DocumentosHeader";

import DescriptionIcon from '@mui/icons-material/Description';

export default function ConfiguracionFacturacionPage() {
    return(
        <PageBg>
        
            <Container>
                
                <DocumentosHeader nombre="Configuración de Facturación" color="success.light" icon={<DescriptionIcon sx={{fontSize:32}}/>}></DocumentosHeader>
        <ConfiguracionFacturacionCard/>
            </Container>
        </PageBg>
    )
}