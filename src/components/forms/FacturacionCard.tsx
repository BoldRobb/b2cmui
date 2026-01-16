import {Card, Divider, Stack, Typography, FormControl, FormLabel, FormHelperText, TextField, Select, InputAdornment, FormControlLabel, Checkbox, Button, Box, Grid, MenuItem, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import type { FormularioFacturarModel, MetadatosFacturacionBuscada, FormularioFacturar } from '../../types/FacturacionInterface';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getFormaPagoOptions,
  getRegimenFiscalByTipo,
  getUsoCFDIByTipo,
  UsoCFDI,
} from '../../types/FacturacionEnums';
import { apiFacturacion } from '../../api/ApiFacturacion';
import { notificationService } from '../../services/notificationService';

export interface FacturacionCardProps{
    metadatos: MetadatosFacturacionBuscada,
    formulario: FormularioFacturarModel
}

export default function FacturacionCard({metadatos, formulario}: FacturacionCardProps) {
    const [formValues, setFormValues] = useState<Record<string, string | boolean>>({
        rfc: '',
        claveRegimenFiscal: '',
        usoCfdi: '',
        razonSocial: '',
        nombreFiscal: '',
        claveFormaPago: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        colonia: '',
        codigoPostal: '',
        municipio: '',
        ciudad: '',
        estado: '',
        correo: '',
        verificacionChecked: false
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [esPersonaFisica, setEsPersonaFisica] = useState<boolean>(true);
    const [regimenesFiltrados, setRegimenesFiltrados] = useState<{ value: string; label: string }[]>([]);
    const [usosCfdiFiltrados, setUsosCfdiFiltrados] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        if (metadatos?.rfc) {
            const esPersonaFisicaDetectada = metadatos.rfc.length === 13;
            setEsPersonaFisica(esPersonaFisicaDetectada);
        }
    }, [metadatos?.rfc]);

    useEffect(() => {
        setRegimenesFiltrados(getRegimenFiscalByTipo(esPersonaFisica));
        setUsosCfdiFiltrados(getUsoCFDIByTipo(esPersonaFisica));
    }, [esPersonaFisica]);

    useEffect(() => {
        if (metadatos) {
            setFormValues(prev => ({
                ...prev,
                rfc: metadatos.rfc || '',
                razonSocial: metadatos.razonSocial || ''
            }));
            
            fetchInfoFacturacionCliente();
        }
    }, [metadatos, formulario]);

    const fetchInfoFacturacionCliente = async () => {
        if (!metadatos) return;
        
        try {
            const info = await apiFacturacion.getInfoFacturacionCliente(metadatos);
            autocompletarFormulario(info);
        } catch (error) {
            console.error('Error al cargar la información de facturación del cliente:', error);
        }
    };

    const autocompletarFormulario = (info: FormularioFacturar) => {
        if (info && info.valid) {
            setFormValues(prev => ({
                ...prev,
                rfc: info.datosFiscales?.rfc || prev.rfc,
                claveRegimenFiscal: info.datosFiscales?.claveRegimenFiscal || '',
                usoCfdi: info.datosFiscales?.usoCfdi || '',
                razonSocial: info.datosFiscales?.razonSocial || prev.razonSocial,
                nombreFiscal: info.datosFiscales?.nombreFiscal || '',
                claveFormaPago: info.datosFiscales?.claveFormaPago || '',
                calle: info.datosDireccion?.calle || '',
                numeroInterior: info.datosDireccion?.numeroInterior || '',
                numeroExterior: info.datosDireccion?.numeroExterior || '',
                colonia: info.datosDireccion?.colonia || '',
                ciudad: info.datosDireccion?.ciudad || '',
                codigoPostal: info.datosDireccion?.codigoPostal || '',
                municipio: info.datosDireccion?.municipio || '',
                estado: info.datosDireccion?.estado || '',
                correo: info.correo || '',
            }));

            if (info.datosFiscales?.claveRegimenFiscal) {
                handleRegimenFiscalChange(info.datosFiscales.claveRegimenFiscal);
            }
        }
    };

    const handleRegimenFiscalChange = (regimenValue: string) => {
        if (!formulario) return;

        const usosCfdiMap = formulario?.usosCfdiPorRegimenes;
        
        if (!usosCfdiMap) {
            setUsosCfdiFiltrados(getUsoCFDIByTipo(esPersonaFisica));
            setFormValues(prev => ({ ...prev, usoCfdi: '' }));
            return;
        }
        
        const clavesUsosDisponibles: string[] = usosCfdiMap[regimenValue] || [];

        if (clavesUsosDisponibles.length > 0) {
            const opcionesUsosCfdi = clavesUsosDisponibles
                .map(clave => {
                    const usoCompleto = Object.values(UsoCFDI).find(uso => uso.clave === clave);
                    if (!usoCompleto) return null;
                    return {
                        value: usoCompleto.clave,
                        label: `${usoCompleto.clave} - ${usoCompleto.descripcion}`
                    };
                })
                .filter((uso): uso is { value: string; label: string } => uso !== null);
            
            setUsosCfdiFiltrados(opcionesUsosCfdi);
        }

        setFormValues(prev => ({ ...prev, usoCfdi: '' }));
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
        
        // Limpiar error del campo si existe
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleUppercaseChange = (field: string, value: string) => {
        handleInputChange(field, value.toUpperCase());
    };

    const validateRFC = (rfc: string): string | null => {
        if (!rfc) return 'El RFC es requerido';
        if (!/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(rfc)) return 'RFC inválido';
        return null;
    };

    const validateEmail = (email: string): string | null => {
        if (!email) return 'El correo es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingrese un correo válido';
        return null;
    };

    const validateCodigoPostal = (cp: string): string | null => {
        if (!cp) return 'El código postal es requerido';
        if (!/^\d{5}$/.test(cp)) return 'Debe tener 5 dígitos';
        return null;
    };

    const validateAllFields = (): boolean => {
        const errors: Record<string, string> = {};
        
        // Validar RFC
        const rfcError = validateRFC(formValues.rfc as string);
        if (rfcError) errors.rfc = rfcError;
        
        // Validar Régimen Fiscal
        if (!formValues.claveRegimenFiscal) {
            errors.claveRegimenFiscal = 'Seleccione un régimen fiscal';
        }
        
        // Validar Uso CFDI
        if (!formValues.usoCfdi) {
            errors.usoCfdi = 'Seleccione un uso de CFDI';
        }
        
        // Validar Razón Social
        if (!formValues.razonSocial) {
            errors.razonSocial = 'La razón social es requerida';
        }
        
        // Validar Nombre Fiscal
        if (!formValues.nombreFiscal) {
            errors.nombreFiscal = 'El nombre fiscal es requerido';
        }
        
        // Validar Forma de Pago
        if (!formValues.claveFormaPago) {
            errors.claveFormaPago = 'Seleccione una forma de pago';
        }
        
        // Validar Código Postal
        const cpError = validateCodigoPostal(formValues.codigoPostal as string);
        if (cpError) errors.codigoPostal = cpError;
        
        // Validar Correo
        const emailError = validateEmail(formValues.correo as string);
        if (emailError) errors.correo = emailError;
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formValues.verificacionChecked) {
            notificationService.warning('Debe verificar que los datos están correctos');
            return;
        }
        
        // Validar todos los campos
        if (!validateAllFields()) {
            notificationService.error('Por favor, complete todos los campos requeridos correctamente');
            return;
        }
        
        setLoading(true);
        
        try {
            const formularioCompleto: FormularioFacturar = {
                datosFiscales: {
                    rfc: formValues.rfc as string || metadatos?.rfc || '',
                    claveRegimenFiscal: formValues.claveRegimenFiscal as string || '',
                    usoCfdi: formValues.usoCfdi as string || '',
                    razonSocial: formValues.razonSocial as string || metadatos?.razonSocial || '',
                    nombreFiscal: formValues.nombreFiscal as string || '',
                    claveFormaPago: formValues.claveFormaPago as string || ''
                },
                datosDireccion: {
                    calle: formValues.calle as string || '',
                    numeroInterior: formValues.numeroInterior as string || '',
                    numeroExterior: formValues.numeroExterior as string || '',
                    colonia: formValues.colonia as string || '',
                    ciudad: formValues.ciudad as string || '',
                    codigoPostal: formValues.codigoPostal as string || '',
                    municipio: formValues.municipio as string || '',
                    estado: formValues.estado as string || ''
                },
                correo: formValues.correo as string || '',
                folio: metadatos?.folio || '',
                valid: true
            };
            console.log('Formulario a enviar:', formularioCompleto);
            const resultado = await apiFacturacion.generarFactura(formularioCompleto);
            
            if (resultado.success) {
                if (resultado.correo) {
                    if (resultado.correo.enviado) {
                        notificationService.success('La factura ha sido enviada al correo.');
                    } else {
                        notificationService.warning('No se pudo enviar la factura al correo: ' + resultado.correo.error);
                    }
                }
                navigate(`/facturacion/factura?folio=${resultado.folio}`, { replace: true });
            } else {
                notificationService.error(resultado.error || 'Error al generar la factura');
                if (resultado.error && resultado.error.includes("No se pudo timbrar")) {
                    navigate('/facturacion');
                }
                setLoading(false);
            }
        } catch (error) {
            console.error('Error al generar la factura:', error);
            notificationService.error('Error al procesar la factura');
            setLoading(false);
        }
    };


    return (
        <Card>
          <Box
          component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
          >

          
            <Stack direction="column" sx={{py:1, gap:2}}>
                <Typography variant="h5" color="initial">
                    Completa los datos para facturar
                </Typography>
                <Divider sx={{my:'6'}} />
                <Typography variant='h3'> Datos fiscales</Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth error={!!fieldErrors.rfc}>
                        <FormLabel>* RFC</FormLabel>
                        <TextField
                          id="rfc"
                          placeholder="RFC"
                          value={formValues.rfc || ''}
                          onChange={(e) => handleUppercaseChange('rfc', e.target.value)}
                          disabled
                          inputProps={{ maxLength: 13, style: { textTransform: 'uppercase' } }}
                          fullWidth
                        />
                        {fieldErrors.rfc && <FormHelperText>{fieldErrors.rfc}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <FormLabel>Método de pago</FormLabel>
                        <TextField
                          id="metodoPago"
                          value="PUE - Pago en una sola exhibición"
                          disabled
                          fullWidth
                        />
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                      <FormControl fullWidth error={!!fieldErrors.claveRegimenFiscal}>
                        <FormLabel>* Régimen Fiscal</FormLabel>
                        <Select
                          id="regimenFiscal"
                          value={formValues.claveRegimenFiscal || ''}
                          onChange={(e) => {
                            const value = String(e.target.value);
                            handleInputChange('claveRegimenFiscal', value);
                            handleRegimenFiscalChange(value);
                          }}
                          fullWidth
                        >
                          {regimenesFiltrados.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {fieldErrors.claveRegimenFiscal && (
                          <FormHelperText>{fieldErrors.claveRegimenFiscal}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth error={!!fieldErrors.usoCfdi}>
                        <FormLabel>* Uso de CFDI</FormLabel>
                        <Select
                          id="usoCfdi"
                          value={formValues.usoCfdi || ''}
                          onChange={(e) => handleInputChange('usoCfdi', e.target.value)}
                          fullWidth
                        >
                          {usosCfdiFiltrados.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {fieldErrors.usoCfdi && (
                          <FormHelperText>{fieldErrors.usoCfdi}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid size={12}>
                      <FormControl fullWidth error={!!fieldErrors.razonSocial}>
                        <FormLabel>* Razón social o Nombre</FormLabel>
                        <TextField
                          fullWidth
                          id="razonSocial"
                          placeholder="Razón social o Nombre"
                          value={formValues.razonSocial || ''}
                          onChange={(e) => handleUppercaseChange('razonSocial', e.target.value)}
                          inputProps={{ style: { textTransform: 'uppercase' } }}
                        />
                        {fieldErrors.razonSocial && (
                          <FormHelperText>{fieldErrors.razonSocial}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                      <FormControl fullWidth error={!!fieldErrors.nombreFiscal}>
                        <FormLabel>* Nombre Fiscal</FormLabel>
                        <TextField
                          fullWidth
                          id="nombreFiscal"
                          placeholder="Nombre Fiscal"
                          value={formValues.nombreFiscal || ''}
                          onChange={(e) => handleUppercaseChange('nombreFiscal', e.target.value)}
                          inputProps={{ style: { textTransform: 'uppercase' } }}
                        />
                        {fieldErrors.nombreFiscal && (
                          <FormHelperText>{fieldErrors.nombreFiscal}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                      
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth error={!!fieldErrors.claveFormaPago}>
                        <FormLabel>* Forma de Pago</FormLabel>
                        <Select
                          id="formaPago"
                          value={formValues.claveFormaPago || ''}
                          onChange={(e) => handleInputChange('claveFormaPago', e.target.value)}
                          disabled={formulario?.deshabilitarCapturaFormaDePago}
                          fullWidth
                        >
                          {getFormaPagoOptions().map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {fieldErrors.claveFormaPago && (
                          <FormHelperText>{fieldErrors.claveFormaPago}</FormHelperText>
                        )}
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
                        value={formValues.calle || ''}
                        onChange={(e) => handleUppercaseChange('calle', e.target.value)}
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        fullWidth
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 6, md: 2 }}>
                    <FormControl fullWidth>
                      <FormLabel>No. Ext.</FormLabel>
                      <TextField
                        id="numeroExterior"
                        placeholder="No. Ext."
                        value={formValues.numeroExterior || ''}
                        onChange={(e) => handleUppercaseChange('numeroExterior', e.target.value)}
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        fullWidth
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 6, md: 2 }}>
                    <FormControl fullWidth>
                      <FormLabel>No. Int.</FormLabel>
                      <TextField
                        id="numeroInterior"
                        placeholder="Opcional"
                        value={formValues.numeroInterior || ''}
                        onChange={(e) => handleUppercaseChange('numeroInterior', e.target.value)}
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        fullWidth
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <FormLabel>Colonia</FormLabel>
                      <TextField
                        id="colonia"
                        placeholder="Colonia"
                        value={formValues.colonia || ''}
                        onChange={(e) => handleUppercaseChange('colonia', e.target.value)}
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        fullWidth
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 6, md: 2 }}>
                    <FormControl fullWidth error={!!fieldErrors.codigoPostal}>
                      <FormLabel>* Código Postal</FormLabel>
                      <TextField
                        id="codigoPostal"
                        placeholder="Código Postal"
                        value={formValues.codigoPostal || ''}
                        onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                        inputProps={{ maxLength: 5 }}
                        fullWidth
                      />
                      {fieldErrors.codigoPostal && (
                        <FormHelperText>{fieldErrors.codigoPostal}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 6, md: 4 }}>
                    <FormControl fullWidth>
                      <FormLabel>Municipio/Localidad</FormLabel>
                      <TextField
                        id="municipioLocalidad"
                        placeholder="Municipio/Localidad"
                        value={formValues.municipio || ''}
                        onChange={(e) => handleUppercaseChange('municipio', e.target.value)}
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        fullWidth
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <FormLabel>Ciudad</FormLabel>
                      <TextField
                        id="ciudad"
                        placeholder="Ciudad"
                        value={formValues.ciudad || ''}
                        onChange={(e) => handleUppercaseChange('ciudad', e.target.value)}
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        fullWidth
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        id="estado"
                        value={formValues.estado || ''}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        fullWidth
                      >
                        {formulario?.estados?.map(estado => (
                          <MenuItem key={estado} value={estado.toUpperCase()}>
                            {estado.toUpperCase()}
                          </MenuItem>
                        )) || []}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider/>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FormControl fullWidth error={!!fieldErrors.correo}>
                      <FormLabel>* Correo Electrónico</FormLabel>
                      <TextField
                        id="correo"
                        placeholder="alguien@ejemplo.com"
                        value={formValues.correo || ''}
                        onChange={(e) => handleInputChange('correo', e.target.value)}
                        slotProps={{
                            input:{
                                startAdornment:<InputAdornment position='start'><EmailIcon /></InputAdornment>,
                            }
                        }}
                        fullWidth
                      />
                      {fieldErrors.correo && (
                        <FormHelperText>{fieldErrors.correo}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>

                <FormControlLabel
                  sx={{width:'100%'}}
                  label="Verifico que mis datos están correctos"
                  control={
                    <Checkbox
                      checked={formValues.verificacionChecked as boolean}
                      onChange={(e) => handleInputChange('verificacionChecked', e.target.checked)}
                      color="primary"
                    />
                  }
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="outlined" 
                    startIcon={loading ? <CircularProgress size={20} /> : <MonetizationOnIcon />}
                    disabled={!formValues.verificacionChecked || loading}
                  >
                    {loading ? 'Generando factura...' : 'Facturar'}
                  </Button>
                </Box>
            </Stack>
            </Box>
        </Card>
    );
} 