import { Box } from "@mui/material";
import { useColorScheme } from '@mui/material/styles';
import { useLogoUrl } from "../hooks/useLogo";


export default function Content() {
  const { mode, systemMode } = useColorScheme();
  const { data: logoClaro } = useLogoUrl('fondo-claro'); // React Query para el logo
  const { data: logoOscuro } = useLogoUrl('fondo-oscuro'); // React Query para el logo
  // Determina el modo efectivo: si es 'system', usa systemMode
  const effectiveMode = mode === 'system' ? systemMode : mode;
  
  return (
    <Box
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <img 
        src={effectiveMode === 'dark' ? logoOscuro : logoClaro} 
        alt="Macronnect Logo" 
      />
    </Box>
  );
}
