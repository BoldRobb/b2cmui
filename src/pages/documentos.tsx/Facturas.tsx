import { Box, Container } from '@mui/material';
import DocumentosHeader from '../../components/common/DocumentosHeader';
import DocumentosTable from '../../components/common/DocumentosTable';
import PageBg from '../../components/layout/PageBg';

export default function FacturasPage() {

  return (
        <PageBg>
          <Container>
        {/* Header */}
                <Box sx={{ mb: 4 }}>
                  <DocumentosHeader nombre="Mis facturas" 
                  color="info.light"
                  />
                </Box>
    
                {/* Results Section */}
                <DocumentosTable tipo="facturas"
                />
            </Container>
        </PageBg>
  );
}
