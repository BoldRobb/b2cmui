import { Card, CardContent, Typography, Box } from '@mui/material';

interface BalanceCardProps {
  title: string;
  amount: string;
  colorLight: string;
  colorDark: string;
}

function BalanceCard({ title, amount, colorLight, colorDark }: BalanceCardProps) {
  return (
    <Card
      sx={(theme) => ({
        flex: 1,
        minWidth: 280,
        backgroundColor: colorLight,
        color: 'white',
        borderRadius: 3,
        mt: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        },
        ...theme.applyStyles('dark', {
          backgroundColor: colorDark,
        }),
      })}
    >
      <CardContent sx={{ py: 3, px: 3 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            mb: 0,
            
            fontSize: '1.1rem',
            opacity: 0.95
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            fontSize: '1.75rem'
          }}
        >
          {amount}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function BalanceCards() {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2.5,
        mb: 4,
        flexWrap: { xs: 'wrap', md: 'nowrap' },
      }}
    >
      <BalanceCard 
        title="Saldo" 
        amount="$11,826.10 MXN" 
        colorLight="#66bb6a" 
        colorDark="#308633ff"
      />
      <BalanceCard 
        title="Límite" 
        amount="$0.00 MXN" 
        colorLight="#ffa726" 
        colorDark="#c96603ff"
      />
      <BalanceCard 
        title="Disponible" 
        amount="-$11,826.10 MXN" 
        colorLight="#42a5f5" 
        colorDark="#135facff"
      />
    </Box>
  );
}
