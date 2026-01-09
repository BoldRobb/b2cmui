import { Box, Container } from '@mui/material';
import DocumentosHeader from '../../components/common/DocumentosHeader';
import DocumentosTable from '../../components/common/DocumentosTable';
import PageBg from '../../components/layout/PageBg';

export default function FacturasServiciosPage() {

  return (
    <PageBg>
      <Container>
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
    </PageBg>
  );
}
