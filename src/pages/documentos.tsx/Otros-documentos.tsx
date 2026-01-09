import { Box, Container } from '@mui/material';
import DocumentosHeader from '../../components/common/DocumentosHeader';
import DocumentosTable from '../../components/common/DocumentosTable';
import PageBg from '../../components/layout/PageBg';

export default function OtrosDocumentosPage() {

  return (
    <PageBg>
      <Container>
    {/* Header */}
            <Box sx={{ mb: 4 }}>
              <DocumentosHeader nombre="Mis otros documentos" 
              color="neutral.light"
              />
            </Box>

            {/* Results Section */}
            <DocumentosTable tipo="otros-documentos"
            />
        </Container>
    </PageBg>
  );
}
