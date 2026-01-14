import { Box, MenuItem, Select, Table, TableBody, TableCell, CircularProgress, TableContainer, TableHead, TableRow, Typography, useColorScheme, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import type { HistorialResponsePaginada } from "../types";
import { apiHistorial } from "../api/ApiHistorial";
import { formatearFechaHora } from "../types/DocumentosInterface";

export default function HistorialTable(){
const {mode} = useColorScheme();
const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [historialData, setHistorialData] = useState<HistorialResponsePaginada>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHistorial(currentPage, currentPageSize);
    }, [currentPage, currentPageSize]);

    const fetchHistorial = async (page: number, pageSize: number) => {
        setLoading(true);
        try {
            const data = await apiHistorial.getHistorial(page, pageSize);
            setHistorialData(data);
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = (page: number, pageSize?: number) => {
        
        setCurrentPage(page);
        if (pageSize!== currentPageSize && pageSize) {
            setCurrentPageSize(pageSize);
            setCurrentPage(1);
        }
    }

    const totalPages = historialData?.totalPages ?? 0;
    const totalItems = historialData?.totalElements ?? 0;
    const startItem = historialData?.content.length ? (currentPage - 1) * currentPageSize + 1 : 0;
    const endItem = historialData?.content.length ? Math.min(startItem + historialData.content.length - 1, totalItems) : 0;

    return(
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              Mostrar:
            </Typography>
            <Select
              size="small"
              value={currentPageSize}
              onChange={(e) => handlePageChange(1, Number(e.target.value))}
              sx={{ minWidth: 80 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </Box>
        <TableContainer sx={{ position: 'relative', maxHeight: 'calc(7 * 70px + 66px)', overflow: 'auto', mt: 2 }}>
            { ( loading) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'),
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}
          
        <Table stickyHeader>
            <TableHead>
                <TableRow sx={{ backgroundColor: 'background.default' }}>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Descripción
              </TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                {historialData?.content.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell sx={{ fontSize: '0.9rem', width: 200 }}>
                            <Typography variant="subtitle2" fontWeight={700} color="initial">{formatearFechaHora(item.fecha.toString())}</Typography>
                            
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem' }}>
                            <Typography variant="body1" fontWeight={400} color="initial">{item.descripcion}</Typography>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {historialData?.content.length ? `${startItem}-${endItem} de ${totalItems} registros` : 'Sin registros'}
                </Typography>
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => handlePageChange(page)}
                    color="primary"
                    size="small"
                  />
                )}
              </Box>
        </Box>
       
    )

}