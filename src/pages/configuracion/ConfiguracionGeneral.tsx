import { Container } from "@mui/material";
import ConfiguracionGeneralCard from "../../components/configuracion/ConfiguracionGeneralCard";
import PageBg from "../../components/layout/PageBg";
import DocumentosHeader from "../../components/common/DocumentosHeader";
import SettingIcon from '@mui/icons-material/Settings';
export default function ConfiguracionGeneralPage() {
    return(
        <PageBg>
            <Container>
                <DocumentosHeader nombre="Configuración General" color="primary.light" icon={<SettingIcon sx={{fontSize:32}}/>}></DocumentosHeader>
        <ConfiguracionGeneralCard/>
            </Container>
        </PageBg>
    )
}