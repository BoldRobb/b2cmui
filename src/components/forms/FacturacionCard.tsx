import {Card, Divider, Stack, Typography, FormControl, FormLabel, FormHelperText, TextField, Select, InputAdornment, FormControlLabel, Checkbox, Button, Box, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import type { FormularioFacturarModel, MetadatosFacturacionBuscada } from '../../types/FacturacionInterface';
import { useEffect, useState } from 'react';

export interface FacturacionCardProps{
    metadatos: MetadatosFacturacionBuscada,
    formulario: FormularioFacturarModel
    
}


export default function FacturacionCard({metadatos, formulario}: FacturacionCardProps) {

        const [formValues, setFormValues] = useState<Record<string, string | boolean | null>>({});
        const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() =>{

        

    },[metadatos,formulario])


    return (
        <Card>
            <Stack direction="column" sx={{py:1, gap:2}}>
                <Typography variant="h5" color="initial">
                    Completa los datos para facturar
                </Typography>
                <Divider sx={{my:'6'}} />
                <Typography variant='h3'> Datos fiscales</Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <FormLabel>* RFC</FormLabel>
                        <TextField
                          id="rfc"
                          placeholder="RFC"
                          fullWidth
                        />
                        <FormHelperText>onoo</FormHelperText>
                      </FormControl>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                          <FormLabel>Método de pago</FormLabel>
                        <Select
                          id="metodoPago"
                          fullWidth
                        />
                        <FormHelperText>osiii</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                      <FormControl fullWidth>
                        <FormLabel>* Régimen Fiscal</FormLabel>
                        <Select
                          id="regimenFiscal"
                          fullWidth
                        />
                        <FormHelperText>onoo2</FormHelperText>
                      </FormControl>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth>
                          <FormLabel>* Uso de CFDI</FormLabel>
                        <Select
                          id="usoCfdi"
                          fullWidth
                        />
                        <FormHelperText>osii2</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid size={12}>
                      <FormControl fullWidth>
                        <FormLabel>* Razón social o Nombre</FormLabel>
                        <TextField
                          fullWidth
                          id="razonSocial"
                          placeholder="Razón social o Nombre"
                        />
                        <FormHelperText></FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                      <FormControl fullWidth>
                        <FormLabel>* Nombre Fiscal</FormLabel>
                        <TextField
                          fullWidth
                          id="nombreFiscal"
                          placeholder="Nombre Fiscal"
                        />
                        <FormHelperText>onoo2</FormHelperText>
                      </FormControl>
                    </Grid>
                      
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth>
                        <FormLabel>* Forma de Pago</FormLabel>
                        <Select
                          id="formaPago"
                          fullWidth
                        />
                        <FormHelperText>osii2</FormHelperText>
                      </FormControl>
                    </Grid>
                </Grid>

                <Divider/>
                <Typography variant="h4" color="initial">Dirección</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <FormControl fullWidth>
                      <FormLabel>Calle</FormLabel>
                      <TextField
                        id="calle"
                        placeholder="Calle"
                        fullWidth
                      />
                      <FormHelperText></FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 6, md: 2 }}>
                    <FormControl fullWidth>
                      <FormLabel>Número Exterior</FormLabel>
                      <TextField
                        id="numeroExterior"
                        placeholder="Número Exterior"
                        fullWidth
                      />
                      <FormHelperText></FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 6, md: 2 }}>
                    <FormControl fullWidth>
                      <FormLabel>Número Interior</FormLabel>
                      <TextField
                        id="numeroInterior"
                        placeholder="Número Interior"
                        fullWidth
                      />
                      <FormHelperText></FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <FormLabel>Colonia</FormLabel>
                      <TextField
                        id="colonia"
                        placeholder="Colonia"
                        fullWidth
                      />
                      <FormHelperText></FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 6, md: 2 }}>
                    <FormControl fullWidth>
                      <FormLabel>* Código postal</FormLabel>
                      <TextField
                        id="codigoPostal"
                        placeholder="Código Postal"
                        fullWidth
                      />
                      <FormHelperText></FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 6, md: 4 }}>
                    <FormControl fullWidth>
                      <FormLabel>Municipio/Localidad</FormLabel>
                      <TextField
                        id="municipioLocalidad"
                        placeholder="Municipio/Localidad"
                        fullWidth
                      />
                      <FormHelperText></FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <FormLabel>Ciudad</FormLabel>
                      <TextField
                        id="ciudad"
                        placeholder="Ciudad"
                        fullWidth
                      />
                      <FormHelperText></FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        id="estado"
                        fullWidth
                      />
                      <FormHelperText></FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider/>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <FormLabel>Correo</FormLabel>
                      <TextField
                        id="correo"
                        placeholder="Correo electrónico"
                        slotProps={{
                            input:{
                                startAdornment:<InputAdornment position='start'><EmailIcon /></InputAdornment>,
                            }
                        }}
                        fullWidth
                      />
                      <FormHelperText></FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <FormControlLabel
                sx={{width:'20%'}}
                  label="Verifico que mis datos están correctos"
                  control={
                    <Checkbox
                      value=""
                      checked={false}
                      color="primary"
                    />
                  }
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button type="submit" loading={false} variant="outlined" startIcon={<MonetizationOnIcon />}>
                    Facturar
                  </Button>
                </Box>
            </Stack>
        </Card>
    );
} 