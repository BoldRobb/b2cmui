import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface DataRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function DataRow({ label, value, icon }: DataRowProps) {
  return (
    <Box 
      sx={{ 
        mb: 2.5,
        p: 2,
        borderRadius: 2,
        backgroundColor: (theme) => theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.03)'
          : 'rgba(0, 0, 0, 0.02)',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box 
          sx={{ 
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            fontWeight: 700, 
            color: 'text.secondary',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {label}
        </Typography>
      </Box>
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'text.primary',
          fontSize: '0.875rem',
          fontWeight: 500,
          lineHeight: 1.5,
          pl: 4
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function MyDataCard() {
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
            Mis datos
          </Typography>
        </Box>
        
        <Stack spacing={0}>
          <DataRow
            label="Nombre"
            value="SERVICIO PAN AMERICANO DE PROTECCION. S A DE C V"
            icon={<PersonIcon sx={{ fontSize: 20 }} />}
          />
          <DataRow 
            label="Código" 
            value="000010"
            icon={<BadgeIcon sx={{ fontSize: 20 }} />}
          />
          <DataRow 
            label="RFC" 
            value="SPA810429PU2"
            icon={<FingerprintIcon sx={{ fontSize: 20 }} />}
          />
          <DataRow 
            label="Dirección" 
            value="25,CIUDAD DE MEXICO,CIUDAD DE MÉXICO"
            icon={<LocationOnIcon sx={{ fontSize: 20 }} />}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
