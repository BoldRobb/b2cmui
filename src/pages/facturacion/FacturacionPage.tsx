import { Grid, Stack } from "@mui/material";
import PageBg from "../../components/layout/PageBg";
import FacturacionCard from "../../components/forms/FacturacionCard";
import DatosEmpresaCard from "../../components/facturacionCards/DatosEmpresaCard";
import DatosDocumentoCard from "../../components/facturacionCards/DatosDocumentoCard";
import { useLocation, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import type { DatosDocumentoFacturable, FormularioFacturarModel, MetadatosFacturacionBuscada } from "../../types/FacturacionInterface";
import { notificationService } from "../../services/notificationService";
import { apiFacturacion } from "../../api/ApiFacturacion";

export default function FacturacionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [metadatos, setMetadatos] = useState<MetadatosFacturacionBuscada | null>(null);
  const [documento, setDocumento] = useState<DatosDocumentoFacturable | null>(null);  
  const [formularioFacturarModel, setFormularioFacturarModel] = useState<FormularioFacturarModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  
    useEffect(() => {
    const metadatosFromState = location.state?.metadatos as MetadatosFacturacionBuscada;
    
    if (!metadatosFromState) {
      notificationService.error('Error: No se proporcionaron los metadatos de la factura');
      navigate('/facturacion');
      return;
    }
    setMetadatos(metadatosFromState);
    fetchFormularioFacturarModel(metadatosFromState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, navigate]);

  const fetchFormularioFacturarModel = async (metadatosFactura: MetadatosFacturacionBuscada) => {
    setLoadingData(true);
    try {
      const modelo = await apiFacturacion.getFacturarModel(metadatosFactura);
      setFormularioFacturarModel(modelo);

      if (modelo.documento) {
        setDocumento(modelo.documento);
      }
      
    } catch (error) {
      console.error('Error al cargar el modelo del formulario:', error);
      setLoadingData(false);
    }
  };

  return (
        <PageBg>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {loadingData && metadatos && formularioFacturarModel && documento &&(
                   <>
                   
                   <Grid size={{ xs: 12, md: 8 }} >
                        <FacturacionCard  
                        metadatos={metadatos}
                        formulario={formularioFacturarModel}  />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} >
                        <Stack direction='column' sx={{gap:2}}>
                        <DatosEmpresaCard
                        formulario = {formularioFacturarModel}
                        />
                        <DatosDocumentoCard  
                        documento={documento}
                        />
                        </Stack>
                    </Grid>
                    </>
                )}
                
                

            </Grid>
        </PageBg>
    )
};