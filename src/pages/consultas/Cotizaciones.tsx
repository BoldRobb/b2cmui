import { Container } from "@mui/material";
import PageBg from "../../components/layout/PageBg";
import DocumentosHeader from "../../components/common/DocumentosHeader";
import DocumentosDetalladosTable from "../../components/common/DocumentosDetalladosTable";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

export default function CotizacionesPage(){
    return(
        <PageBg>
            <Container>
                <DocumentosHeader nombre="Mis cotizaciones" icon={<RequestQuoteIcon  sx={{ fontSize: 32 }} />} color = 'primary.light' />
                {/*Collapsible Table para pedidos y cotizaciones*/}
                <DocumentosDetalladosTable tipo="cotizaciones" />
            </Container>

        </PageBg>
    )
    }