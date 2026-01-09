import { Container, Grid } from '@mui/material';
import PageBg from '../../components/layout/PageBg';
import CreditUsageCard from '../../components/dashboard/CreditUsageCard';
import AccountStatementCard from '../../components/dashboard/AccountStatementCard';
import AntiguedadTable from '../../components/common/AntiguedadSaldosTable';
import DocumentosHeader from '../../components/common/DocumentosHeader';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function FacturasServiciosPage() {

  return (
    <PageBg>
       <Container maxWidth="xl">
        <Grid container spacing={2}>
          
          <Grid size={5} sx={{maxHeight:'550px'}}>
          <CreditUsageCard />
          </Grid>
            
            <Grid size={7} sx={{maxHeight:'550px'}}>
          <AccountStatementCard />
          </Grid>
          
          <Grid size={14} sx={{marginTop:'20px', width:'100%',
            '& .MuiContainer-root': {
                paddingLeft: '0px',
                paddingRight: '0px',
              },
          }}>
            <Container maxWidth={false} sx={{paddingLeft:'0px', paddingRight:'0px', width:'100%',
              
            }}> 
              <DocumentosHeader nombre="Antigüedad de Saldos" icon={<AssessmentIcon sx={{ fontSize: 32 }} />} />
              <AntiguedadTable />
            </Container>

          
          </Grid>
          
        </Grid>
        
        </Container> 
    </PageBg>
  );
}
