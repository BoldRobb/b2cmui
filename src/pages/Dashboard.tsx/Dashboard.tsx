import { Container, Grid } from '@mui/material';
import BalanceCards from '../../components/dashboard/BalanceCards';
import MyDataCard from '../../components/dashboard/MyDataCard';
import CreditUsageCard from '../../components/dashboard/CreditUsageCard';
import AccountStatementCard from '../../components/dashboard/AccountStatementCard';
import PageBg from '../../components/layout/PageBg';

export default function DashboardPage() {
  
  return (
    <PageBg>
      <Container
        
      >
        {/* Balance Cards */}
        <BalanceCards />

        {/* Main Dashboard Grid */}
        <Grid container spacing={2.5}>
          {/* Left Column - My Data */}
          <Grid size={{ xs: 12, md: 4}}>
            <MyDataCard />
          </Grid>

          {/* Middle Column - Credit Usage */}
          <Grid size={{ xs: 12, md: 4}} >
            <CreditUsageCard />
          </Grid>

          {/* Right Column - Account Statement */}
          <Grid size={{ xs: 12, md: 4}}>
            <AccountStatementCard />
          </Grid>
        </Grid>
      </Container>
      </PageBg>
  );
}