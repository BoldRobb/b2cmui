import { useState } from 'react';
import { Box, Container } from '@mui/material';
import FacturasHeader from '../components/facturas/FacturasHeader';
import FacturasSearchBar from '../components/facturas/FacturasSearchBar';
import FacturasTable from '../components/facturas/FacturasTable';
import type { Factura } from '../components/facturas/FacturasTable';

const facturasData: Factura[] = [
  { id: '1', operacion: 'FACTURA', folio: 'CD000000402172', fecha: '10 de diciembre de 2025', importe: '$1,500.02' },
  { id: '2', operacion: 'FACTURA', folio: 'CD000000402167', fecha: '9 de diciembre de 2025', importe: '$522.00' },
  { id: '3', operacion: 'FACTURA', folio: 'FDF01-000000006', fecha: '9 de diciembre de 2025', importe: '$3,826.40' },
  { id: '4', operacion: 'FACTURA', folio: 'CD000000402165', fecha: '8 de diciembre de 2025', importe: '$295.00' },
  { id: '5', operacion: 'FACTURA', folio: 'CD000000402163', fecha: '8 de diciembre de 2025', importe: '$3,540.00' },
  { id: '6', operacion: 'FACTURA', folio: 'CT000001077780', fecha: '8 de noviembre de 2025', importe: '$1,284.85' },
  { id: '7', operacion: 'FACTURA', folio: 'CN000000888404', fecha: '29 de octubre de 2025', importe: '$226.27' },
  { id: '8', operacion: 'FACTURA', folio: 'CN000000887106', fecha: '21 de octubre de 2025', importe: '$374.85' },
  { id: '9', operacion: 'FACTURA', folio: 'CN000000886887', fecha: '21 de octubre de 2025', importe: '$206.14' },
];

export default function FacturasPage() {
  const [selectedFacturas, setSelectedFacturas] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  const handleSearch = (searchTerm: string) => {
    console.log('Buscando:', searchTerm);
    // Aquí implementarías la lógica de búsqueda
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedFacturas(facturasData.map((f) => f.id));
    } else {
      setSelectedFacturas([]);
    }
  };

  const handleSelectFactura = (id: string) => {
    setSelectedFacturas((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

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
          <FacturasHeader />
          <FacturasSearchBar onSearch={handleSearch} />
        </Box>

        {/* Results Section */}
        <FacturasTable
          facturas={facturasData}
          selectedFacturas={selectedFacturas}
          onSelectAll={handleSelectAll}
          onSelectFactura={handleSelectFactura}
          page={page}
          totalPages={Math.ceil(facturasData.length / itemsPerPage)}
          onPageChange={handleChangePage}
          totalItems={facturasData.length}
          itemsPerPage={itemsPerPage}
        />
      </Container>
    </Box>
  );
}
