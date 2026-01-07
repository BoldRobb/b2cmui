import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { useDashboardData } from '../../hooks/useClienteData';

interface BalanceCardProps {
  title: string;
  amount: string;
  colorLight: string;
  colorDark: string;
  isLoading?: boolean;
}

function BalanceCard({ title, amount, colorLight, colorDark, isLoading = false }: BalanceCardProps) {
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
      <CardContent sx={{ py: 3, px: 3, pt:0 }}>
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
        {isLoading ? (
          <Skeleton 
            variant="text" 
            width="80%" 
            height={40} 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: 1 }}
          />
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}

export default function BalanceCards() {
  const {estadisticas, isLoading} = useDashboardData();
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
        amount={estadisticas ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(estadisticas.saldoActual) : "$0.00 MXN"} 
        colorLight="#66bb6a" 
        colorDark="#308633ff"
        isLoading={isLoading}
      />
      <BalanceCard 
        title="Límite" 
        amount={estadisticas ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(estadisticas.limiteCredito) : "$0.00 MXN"} 
        colorLight="#ffa726" 
        colorDark="#c96603ff"
        isLoading={isLoading}
      />
      <BalanceCard 
        title="Disponible" 
        amount={estadisticas ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(estadisticas.limiteCredito - estadisticas.saldoActual) : "$0.00 MXN"} 
        colorLight="#42a5f5" 
        colorDark="#135facff"
        isLoading={isLoading}
      />
    </Box>
  );
}
