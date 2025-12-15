import { Box, Container, Grid } from '@mui/material';
import BalanceCards from '../../components/dashboard/BalanceCards';
import MyDataCard from '../../components/dashboard/MyDataCard';
import CreditUsageCard from '../../components/dashboard/CreditUsageCard';
import AccountStatementCard from '../../components/dashboard/AccountStatementCard';

export default function DashboardPage() {
  return (
    <Box
      id="dashboard"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',

        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 12, sm: 14 },
          pb: { xs: 4, sm: 6 },
        }}
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
    </Box>
  );
}