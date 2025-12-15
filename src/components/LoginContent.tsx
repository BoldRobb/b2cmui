import { Box } from "@mui/material";
import { useColorScheme } from '@mui/material/styles';


export default function Content() {
  const { mode, systemMode } = useColorScheme();
  
  // Determina el modo efectivo: si es 'system', usa systemMode
  const effectiveMode = mode === 'system' ? systemMode : mode;
  
  return (
    <Box
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <img 
        src={effectiveMode === 'dark' ? '/macronnect-logo.png' : '/macronnect-logo-color.png'} 
        alt="Macronnect Logo" 
      />
    </Box>
  );
}
