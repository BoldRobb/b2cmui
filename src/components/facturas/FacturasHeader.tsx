import { Box, Typography, Avatar } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

export default function FacturasHeader() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
        <DescriptionIcon sx={{ fontSize: 32 }} />
      </Avatar>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Mis facturas
      </Typography>
    </Box>
  );
}
