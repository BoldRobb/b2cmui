import { Card, Container } from "@mui/material";
import PageBg from "../components/layout/PageBg";
import HistorialTable from "../components/HistorialTable";
import DocumentosHeader from "../components/common/DocumentosHeader";
import HistoryIcon from '@mui/icons-material/History';
export default function HistorialPage() {
    
    return(
        <PageBg>
            <Container>
                <DocumentosHeader nombre="Historial de actividades" icon={<HistoryIcon sx={{fontSize:32}}/>}></DocumentosHeader>
                <Card>
                <HistorialTable />
            </Card>
            </Container>
            
        </PageBg>
    )
}