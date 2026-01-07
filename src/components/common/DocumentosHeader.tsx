import { Box, Typography, Avatar, type SxProps, type Theme } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import type { ReactNode } from 'react';

interface DocumentosHeaderProps {
  nombre: string;
  icon?: ReactNode;
  color?: string;
  avatarSx?: SxProps<Theme>;
}

export default function DocumentosHeader({ 
  nombre, 
  icon = <DescriptionIcon sx={{ fontSize: 32 }} />,
  color = 'warning.light',
  avatarSx
}: DocumentosHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <Avatar sx={{ bgcolor: color, width: 56, height: 56, ...avatarSx }}>
        {icon}
      </Avatar>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {nombre}
      </Typography>
    </Box>
  );
}
