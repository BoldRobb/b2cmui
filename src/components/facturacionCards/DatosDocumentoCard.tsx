import { Card, Typography } from '@mui/material';
import type { DatosDocumentoFacturable } from '../../types/FacturacionInterface';
import { formatearFecha } from '../../types/DocumentosInterface';

export interface DatosDocumentoProps{
    documento: DatosDocumentoFacturable
}

export default function DatosDocumentoCard({documento}: DatosDocumentoProps) {

    return(
        <Card>
            <Typography variant="subtitle1" >Datos del documento</Typography>
            <Typography variant="body1" color='primary.main' sx={{fontWeight:'700'}}>{documento.folio}</Typography>
            <Typography variant="body1" >Fecha: {formatearFecha(documento.fecha)}</Typography>
        </Card>
    )


}