import { Card, CardContent, Typography, Box, Chip, Stack, Skeleton } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useDashboardData } from '../../hooks/useClienteData';



export default function CreditUsageCard() {
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';
  const {estadisticas, isLoading} = useDashboardData();
  const COLORS = isDark
    ? ['#c96603ff', '#135facff']  // Colores más oscuros para tema dark
    : ['#ffa726', '#4fc3f7'];  // Colores originales para tema light
  
  const genData = () => {
    if (estadisticas) {
      const utilizado = estadisticas.saldoActual;
      const disponible = Math.max(0, estadisticas.limiteCredito - estadisticas.saldoActual);
      return [
        { name: 'Utilizado', value: Math.max(0, utilizado) },
        { name: 'Disponible', value: disponible },
      ];
    }
    
    return [
      { name: 'Utilizado', value: 50 },
      { name: 'Disponible', value: 50 },
    ];
  }

  const data = genData();
  const utilizadoPercent = estadisticas 
    ? ((estadisticas.saldoActual / estadisticas.limiteCredito) * 100).toFixed(1)
    : '0';

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700, 
              fontSize: '1.1rem'
            }}
          >
            Uso de crédito
          </Typography>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, height: 280 }}>
            <Skeleton variant="circular" width={200} height={200} />
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: 2
            }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={95}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                  label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                  stroke={isDark ? '#424242' : '#ffffff'}
                  strokeWidth={2}
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '14px',
                    paddingTop: '20px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}

        {/* Stats Summary */}
        <Stack direction="row" spacing={1} justifyContent="center">
          {isLoading ? (
            <Skeleton variant="rounded" width={180} height={32} />
          ) : (
            <Chip
              icon={<TrendingUpIcon />}
              label={`${utilizadoPercent}% Utilizado`}
              sx={{
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(201, 102, 3, 0.2)'
                  : 'rgba(255, 167, 38, 0.15)',
                color: COLORS[0],
                fontWeight: 600,
                fontSize: '0.8rem',
                '& .MuiChip-icon': {
                  color: COLORS[0],
                }
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
