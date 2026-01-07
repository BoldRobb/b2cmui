import { Box, Container } from '@mui/material';
import DocumentosHeader from '../../components/common/DocumentosHeader';
import DocumentosTable from '../../components/common/DocumentosTable';

export default function FacturasServiciosPage() {

  return (
    <Box
     sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',

        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 12, sm: 14 },
          pb: { xs: 4, sm: 6 },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <DocumentosHeader nombre="Mis facturas de servicios" 
          color="secondary.light"
          />
        </Box>

        {/* Results Section */}
        <DocumentosTable tipo="facturas-servicios"
        />
      </Container>
    </Box>
  );
}
