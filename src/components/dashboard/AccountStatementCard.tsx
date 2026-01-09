import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Skeleton,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDashboardData } from '../../hooks/useClienteData';

interface AccountRow {
  key: string;
  type: string;
  days: string;
  balance: number;
}

export default function AccountStatementCard() {

  const {diasMaximos, columnas, estadisticas, isLoading} = useDashboardData();

  const generateRows = (): AccountRow[] => {
    if (!estadisticas?.vencimientos || estadisticas.vencimientos.length === 0) {
      return [];
    }

    return estadisticas.vencimientos.map((vencimiento, index) => {
      const { tipo, dias, saldo } = vencimiento;
      const nombre = columnas?.[tipo] || tipo; // Usar columnas para traducir el tipo
      
      let diasTexto: string;
      
      if (dias !== null && dias !== undefined) {
        diasTexto = dias.toString();
      } else {
        // Si dias es null
        if (tipo === 'ya_vencido') {
          const diaMaximo = diasMaximos?.[tipo] || 120;
          diasTexto = `+${diaMaximo}`;
        } else {
          diasTexto = '-';
        }
      }

      return {
        key: `${tipo}-${dias || 'null'}-${index}`,
        type: nombre,
        days: diasTexto,
        balance: saldo || 0
      };
    });
  };

  const rows = generateRows();
  
  // Calcular total - suma del saldo actual
  const total = estadisticas?.saldoActual || 0;

  const totalFormatted = new Intl.NumberFormat('es-MX', { 
    style: 'currency', 
    currency: 'MXN' 
  }).format(total);

  return (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            mb: 3,
            fontSize: '1.1rem'
          }}
        >
          Estado de cuenta
        </Typography>
        
        <Box>
        <Stack spacing={0}>
          {/* Header Row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 100px',
              gap: 2,
              px: 2,
              py: 1,
              mb: 1.5,
              borderRadius: 1,
              backgroundColor: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>
              Tipo
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', textAlign: 'center' }}>
              Días
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', textAlign: 'right' }}>
              Saldo
            </Typography>
          </Box>

          {/* Data Rows */}
          {isLoading ? (
            // Skeleton rows mientras carga
            <>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 100px',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    mb: 1.5,
                    borderRadius: 2,
                  }}
                >
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Box>
              ))}
            </>
          ) : (
            rows.map((row, index) => (
                <Box
                key={index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 100px',
                  gap: 0,
                  px: 2,
                  py: 1.5,
                  mb: 0,
                  borderRadius: 2,
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent'
                  : index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                  transform: 'translateX(4px)',
                  },
                  
                  alignItems: 'center',
                }}
                >
                {/* Tipo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {row.type === 'No Vencido' ? (
                  <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                  ) : (
                  <AccessTimeIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  {row.type}
                  </Typography>
                </Box>

                {/* Días */}
                <Box sx={{ textAlign: 'center' }}>
                  {row.days !== '-' ? (
                  <Chip
                    label={row.days}
                    size="small"
                    sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(255, 152, 38, 0.15)'
                      : 'rgba(255, 152, 38, 0.1)',
                    color: 'warning.main',
                    }}
                  />
                  ) : (
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    {row.days}
                  </Typography>
                  )}
                </Box>

                {/* Saldo */}
                <Typography
                  variant="body2"
                  sx={{
                  textAlign: 'right',
                  fontWeight: row.balance !== 0 ? 700 : 500,
                  fontSize: '0.875rem',
                  color: row.balance !== 0 ? 'error.main' : 'text.secondary',
                  }}
                >
                  {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row.balance)}
                </Typography>
                </Box>
            ))
          )}
        </Stack>
        
        <Box
          sx={{
            pt: 2.5,
            borderTop: '2px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {isLoading ? (
            <Skeleton variant="text" width={180} height={28} />
          ) : (
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              Total: {totalFormatted}
            </Typography>
          )}
        </Box>
        </Box>
      </CardContent>
    </Card>
  );
}