import { Container } from "@mui/material";
import PageBg from "../../components/layout/PageBg";
import DocumentosHeader from "../../components/common/DocumentosHeader";
import StoreIcon from '@mui/icons-material/Store';

export default function OrdenesPage(){

    

    return(

    <PageBg>
        <Container>
            
            <DocumentosHeader nombre="Mis Órdenes" icon={<StoreIcon sx={{ fontSize: 32 }} />} color="thirdary.main"/>        

            
        </Container>
    </PageBg>

    )

}