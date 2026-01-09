import { Container } from "@mui/material";
import PageBg from "../../components/layout/PageBg";
import DocumentosHeader from "../../components/common/DocumentosHeader";
import InboxIcon from '@mui/icons-material/Inbox';
import DocumentosDetalladosTable from "../../components/common/DocumentosDetalladosTable";

export default function PedidosPage(){
    return(
        <PageBg>
            <Container>
                <DocumentosHeader nombre="Mis pedidos" icon={<InboxIcon sx={{ fontSize: 32 }} />} color = 'primary.light' />
                {/*Collapsible Table para pedidos y cotizaciones*/}
                <DocumentosDetalladosTable tipo="pedidos" />
            </Container>

        </PageBg>
    )
    }