import { Card, Typography } from "@mui/material";
import type { FormularioFacturarModel } from "../../types/FacturacionInterface";

export interface FacturacionCardProps{
    formulario: FormularioFacturarModel
}

export default function FacturacionCard({formulario}: FacturacionCardProps) {

    return(
        <Card>
            <Typography variant="h5">{formulario.empresa.razon_social}</Typography>
            <Typography variant="subtitle1"> {formulario.empresa.rfc}</Typography>
            <Typography variant="subtitle1"> {formulario.empresa.calle} {formulario.empresa.numero_exterior}</Typography>
            <Typography variant="subtitle1"> {formulario.empresa.colonia} {formulario.empresa.codigo_postal}</Typography>
            <Typography variant="subtitle1"> {formulario.empresa.ciudad}, {formulario.empresa.estado}</Typography>
        </Card>
    )

}