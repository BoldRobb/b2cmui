import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Stack,
  Pagination,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';

export interface Factura {
  id: string;
  operacion: string;
  folio: string;
  fecha: string;
  importe: string;
}

interface FacturasTableProps {
  facturas: Factura[];
  selectedFacturas: string[];
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectFactura: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function FacturasTable({
  facturas,
  selectedFacturas,
  onSelectAll,
  onSelectFactura,
  page,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: FacturasTableProps) {
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Resultados
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedFacturas.length === facturas.length && facturas.length > 0}
                  indeterminate={
                    selectedFacturas.length > 0 &&
                    selectedFacturas.length < facturas.length
                  }
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Operación</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Folio</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Importe
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Opciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((factura) => (
              <TableRow
                key={factura.id}
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedFacturas.includes(factura.id)}
                    onChange={() => onSelectFactura(factura.id)}
                  />
                </TableCell>
                <TableCell>{factura.operacion}</TableCell>
                <TableCell>{factura.folio}</TableCell>
                <TableCell>{factura.fecha}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {factura.importe}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    <IconButton
                      size="small"
                      sx={{
                        color: 'error.main',
                        '&:hover': { backgroundColor: 'error.lighter' },
                      }}
                    >
                      <PictureAsPdfIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.lighter' },
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: 'success.main',
                        '&:hover': { backgroundColor: 'success.lighter' },
                      }}
                    >
                      <EmailIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {startItem}-{endItem} de {totalItems} cotizaciones
        </Typography>
        <Pagination
          count={totalPages}
          page={page}
          onChange={onPageChange}
          color="primary"
          shape="rounded"
        />
        <Typography variant="body2" color="text.secondary">
          {itemsPerPage} / page
        </Typography>
      </Box>
    </Box>
  );
}
