import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface AccountRow {
  type: string;
  days: string;
  balance: string;
}

const accountData: AccountRow[] = [
  { type: 'Vencido', days: '15', balance: '$11,826.10' },
  { type: 'Vencido', days: '30', balance: '$0.00' },
  { type: 'Vencido', days: '60', balance: '$0.00' },
  { type: 'Vencido', days: '90', balance: '$0.00' },
  { type: 'Vencido', days: '120', balance: '$0.00' },
  { type: 'Vencido', days: '+120', balance: '$0.00' },
  { type: 'No Vencido', days: '-', balance: '$0.00' },
];

export default function AccountStatementCard() {
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
        
        <Stack spacing={1.5}>
          {/* Header Row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 100px',
              gap: 2,
              px: 2,
              py: 1,
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
          {accountData.map((row, index) => (
            <Box
              key={index}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 100px',
                gap: 2,
                px: 2,
                py: 1.5,
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
                  fontWeight: row.balance !== '$0.00' ? 700 : 500,
                  fontSize: '0.875rem',
                  color: row.balance !== '$0.00' ? 'error.main' : 'text.secondary',
                }}
              >
                {row.balance}
              </Typography>
            </Box>
          ))}
        </Stack>
        <Box
          sx={{
            mt: 3,
            pt: 2.5,
            borderTop: '2px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1rem'
            }}
          >
            Total: $11,826.10 MXN
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
