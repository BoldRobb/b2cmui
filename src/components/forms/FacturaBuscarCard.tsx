import { styled, useColorScheme, alpha } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, CircularProgress, Collapse, Divider, FormControl, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import {  useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFacturacionData } from '../../hooks/useFacturacion';
import type { CampoConfigurable, FormularioConfigurable } from '../../types/FacturacionInterface';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import dayjs from 'dayjs';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { apiFacturacion } from '../../api/ApiFacturacion';
import { notificationService } from '../../services/notificationService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { gray } from '../../assets/shared-theme/themePrimitives';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function FacturaBuscarCard({ onBack }: { onBack?: () => void }) {
    const {mode} = useColorScheme();
    const [searchParams] = useSearchParams();
    const folio = searchParams.get('folio');
    const total = searchParams.get('total');
    const fecha = searchParams.get('fecha');
    const rfc = searchParams.get('rfc');
    const razonSocial = searchParams.get('razon-social');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

        // React Query para datos de facturación
    const {
        campos: camposBase,
        configuracionValida,
        isLoading,
        isError: errorInterno,
        error: errorDatos,
        isLoadingCampos: loadingCampos
        } = useFacturacionData();

    const [camposFacturacion, setCamposFacturacion] = useState<FormularioConfigurable | null>(null);
    const [showTagError, setShowTagError] = useState(false);
    const [messageError, setMessageError] = useState('TEST');
    const [errorTimbrado, setErrorTimbrado] = useState(false);
    const [formValues, setFormValues] = useState<Record<string, string | number | dayjs.Dayjs | null>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
    if (camposBase) {
      if (camposBase?.campos) {
        const formValuesTemp: Record<string, string | number | dayjs.Dayjs> = {};
        
        const camposConValoresURL = camposBase.campos.map((campo: { valor: string; nombre: string; tipoCaptura: string; }) => {
          
          let nuevoValor = campo.valor || '';
          const nombreMinusculas = campo.nombre.toLowerCase();
          if (nombreMinusculas.includes('folio') && folio) {
            nuevoValor = folio;
          } else if (nombreMinusculas.includes('total') && total) {
            nuevoValor = total;
          } else if (nombreMinusculas.includes('fecha') && fecha) {
            nuevoValor = fecha;
          } else if (nombreMinusculas.includes('rfc') && rfc) {
            nuevoValor = rfc;
          } else if (nombreMinusculas.includes('razon social') && razonSocial) {
            nuevoValor = razonSocial;
          }

          if (nuevoValor) {
            if (campo.tipoCaptura === 'FECHA') {
              formValuesTemp[campo.nombre] = dayjs(nuevoValor);
            } else if (campo.tipoCaptura === 'NUMERO') {
              formValuesTemp[campo.nombre] = Number(nuevoValor);
            } else {
              formValuesTemp[campo.nombre] = nuevoValor;
            }
          }

          return {
            ...campo,
            valor: nuevoValor
          };
        });
        
        setCamposFacturacion({ ...camposBase, campos: camposConValoresURL });
        setFormValues(formValuesTemp);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camposBase, folio, total, fecha, rfc, razonSocial]);


  const getValidationRules = (campo: CampoConfigurable) => {
    const rules: {
      required?: boolean;
      pattern?: string;
      minLength?: number;
      maxLength?: number;
    } = {};

    // Por defecto todos los campos son requeridos
    rules.required = true;

    // Validación para RFC
    if (campo.nombre.toLowerCase().includes('rfc')) {
      rules.pattern = '^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$';
      rules.minLength = 12;
      rules.maxLength = 13;
    }

    return rules;
  };

  const validateInputs = () => {
    const errors: Record<string, string> = {};
    
    if (!camposFacturacion?.campos) return false;

    camposFacturacion.campos.forEach((campo) => {
      const value = formValues[campo.nombre];
      const rules = getValidationRules(campo);

      // Validar campo requerido
      if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors[campo.nombre] = 'Este campo es requerido';
        return;
      }

      // Si no hay valor y no es requerido, saltarlo
      if (!value) return;

      // Validar patrón (regex)
      if (rules.pattern && typeof value === 'string') {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
          errors[campo.nombre] = 'RFC inválido';
          return;
        }
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setShowTagError(false);
    
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setErrorTimbrado(false);
    try {
      if (camposFacturacion) {
        const metadatosFactura = await apiFacturacion.getMetadatosFacturacion(camposFacturacion);
            
            if (metadatosFactura) {
              const resultado = await apiFacturacion.buscarMetadatosFacturacion(metadatosFactura);
              if (resultado.success === true) {
                if (resultado.folio) {
                    navigate(`/facturacion/factura?folio=${resultado.folio}`);
                } else if (resultado.metadatos) {
                  navigate(`/facturacion/facturar`,{
                    state: { metadatos: resultado.metadatos }
                  });
                }
              } else {
                setShowTagError(true);
                if(resultado.errorTimbrado){
                  setErrorTimbrado(true);
                  setMessageError(resultado.errorTimbrado);
                }else{
                  setMessageError(resultado.error || 'Error desconocido');
                }
                
              }
            }
      }
    } catch (error) {
      console.error('Error en facturación:', error);
      notificationService.error('Error al procesar la facturación');
    } finally {
      setLoading(false);
    }
  };



    const renderConfiguracionInvalida = () => {
      if(!configuracionValida && !isLoading && !errorInterno){
        return (
        <Collapse in={!configuracionValida && !isLoading && !errorInterno}>
          <Paper 
            elevation={0} 
            variant='outlined' 
            sx={{ px: 2, py: 1, mt: 2, backgroundColor: 'warning.light', color: 'warning.dark' }} 
          >
            <Typography variant='h6'>Configuración inválida</Typography>
            <Typography>La configuración de facturación no está completada, favor de contactar al administrador del sistema.</Typography>
          </Paper>
          </Collapse>
        );
      }
    }
    const renderTagErrorInterno = () => {
      
      if(errorInterno){
          return (
            <Collapse in={errorInterno} >
            <Paper 
              elevation={0} 
            variant='outlined'
            sx={{ px: 2, py: 1, mt: 2, backgroundColor: 'error.light', color: 'error.dark' }}
            >
                <Typography variant='h6'>{errorDatos?.message}</Typography>
                <Typography>Ocurrió un error interno al cargar los datos de facturación. Favor de contactar al administrador del sistema.</Typography>

            </Paper>
            </Collapse>
          );
      }
    
    }
        const renderTagError = () => {
      
      if(showTagError){

      if (errorTimbrado) {
          return (
            <Collapse in={showTagError} >
            <Paper 
            elevation={0} 
            variant='outlined'
            sx={{ px: 2, py: 1, mt: 2, backgroundColor: 'primary.light', color: 'primary.dark' }}
            >
                <Typography variant='h6'> Error de timbrado</Typography>
                <Typography>{messageError}</Typography>
            </Paper>
            </Collapse>
          );
        }else{
          return (
            <Collapse in={showTagError} >
            
            <Paper 
            elevation={0} 
            variant='outlined'
            sx={{ px: 2, py: 1, mt: 2, backgroundColor: 'warning.light', color: 'warning.dark' }}
            
            >
                <Typography variant='h6'> Error en la búsqueda de la factura</Typography>
                <Typography>{messageError}</Typography>
            </Paper>
            </Collapse>
          );
        }
    }
  }

    const updateCampoValue = (nombreCampo: string, nuevoValor: string | number | Date) => {
    setCamposFacturacion(prev => {
      if (!prev || !prev.campos) return prev;

      const camposActualizados = prev.campos.map(campo => {
        if (campo.nombre === nombreCampo) {
          let valorString: string;
          
          // Convertir el valor a string según el tipo
          if (nuevoValor instanceof Date) {
            valorString = dayjs(nuevoValor).format('YYYY-MM-DD');
          } else if (typeof nuevoValor === 'number') {
            valorString = nuevoValor.toString();
          } else {
            valorString = nuevoValor || '';
          }

          return {
            ...campo,
            valor: valorString 
          };
        }
        return campo;
      });

      return {
        ...prev,
        campos: camposActualizados
      };
    });
  };


    const getFieldIcon = (fieldName: string) => {
        const name = fieldName.toLowerCase();


        if (name.includes('folio')) {
        return <InsertDriveFileIcon />;
        }
        if (name.includes('fecha')) {
        return <CalendarMonthIcon  />;
        }
        if (name.includes('total') || name.includes('monto') || name.includes('importe')) {
        return <AttachMoneyIcon  />;
        }
        if (name.includes('rfc')) {
        return <BadgeIcon  />;
        }
        if (name.includes('razon') || name.includes('social') || name.includes('nombre')) {
        return <AccountBalanceIcon  />;
        }
        
        return <InsertDriveFileIcon  />;
    };


    const getFieldInput = (campo: CampoConfigurable) => {
        const fieldKey = campo.nombre;
        const commonProps = {
            placeholder: campo.nombre || '',
            slotProps: {
                input:{
                    startAdornment:<InputAdornment position='start'>{getFieldIcon(campo.nombre)}</InputAdornment>,
                }
                
            },
            sx: {
                borderRadius: '1px',
                width: '100%',
                
                    }
        }
        const handleChange = (value: string | number | Date) => {
    let newValue: string | number | dayjs.Dayjs = '';
    
    if (campo.tipoCaptura === 'NUMERO') {
      newValue = value === '' ? 0 : Number(value);
    } else if (campo.tipoCaptura === 'FECHA') {
      newValue = value instanceof Date ? dayjs(value) : dayjs();
    } else {
      newValue = value as string;
    }

    updateCampoValue(fieldKey, value);
    
    // Actualizar el estado del formulario
    setFormValues(prev => ({
      ...prev,
      [fieldKey]: newValue
    }));

    // Limpiar el error del campo cuando se modifique
    if (fieldErrors[campo.nombre]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[campo.nombre];
        return newErrors;
      });
    }
  };
      switch (campo.tipoCaptura) {
      case 'FECHA':
        return (
          <DesktopDatePicker 
            format="YYYY-MM-DD"
            slotProps={{
              textField: {
                error: !!fieldErrors[campo.nombre],
                helperText: fieldErrors[campo.nombre],
                sx: {
                  width: '100%',
                  borderRadius: '8px',
                  backgroundColor: mode === 'dark' ? 'hsl(220, 35%, 3%) !important' : 'hsl(0, 0%, 99%) !important',
                  '& .MuiOutlinedInput-root': {
                    padding: '8px 12px !important',
                    borderRadius: '8px !important',
                    border: '1px solid hsla(220, 20%, 80%, 0.4) !important',
                    backgroundColor: mode === 'dark' ? 'hsl(220, 35%, 3%) !important' : 'hsl(0, 0%, 99%) !important',
                    height: '2.5rem !important',
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '0 !important',
                  },
                  '& .MuiButtonBase-root':{
                    border: 'none',
                    backgroundColor: 'transparent !important',
                    color: gray[mode === 'dark' ? 300 : 600],
                  },
                  
                  '& fieldset': {
                    border: mode === 'dark' ? '1px solid hsla(220, 20%, 25%, 0.6) !important' : '1px solid hsla(220, 20%, 80%, 0.4) !important',
                  },
                },
              },
              popper: {
                sx: {
                  '& .MuiPaper-root': {
                    borderRadius: '8px',
                    backgroundColor: (theme) => theme.vars
                                          ? `rgba(${theme.vars.palette.background.paperChannel} / 0.9)`
                                          : alpha(theme.palette.background.paper, 0.8),
                    boxShadow: mode === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                  },
                  '& .MuiButtonBase-root':{
                    backgroundColor: 'transparent !important',
                    borderColor: 'transparent !important',
                },
                  '& .MuiPickersDay-root': {
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  },
                },
              },
            }}
            value={formValues[fieldKey] as dayjs.Dayjs || null}
            onChange={(date) =>{
            if (date) {
              handleChange(date.toDate());
            } else {
              handleChange('');
              updateCampoValue(fieldKey, '');
              setFormValues(prev => ({ ...prev, [fieldKey]: null }));
            }
            }}
          />
        );
      
      case 'NUMERO':
        return (
          <TextField 
            {...commonProps}
            type="number"
            error={!!fieldErrors[campo.nombre]}
            helperText={fieldErrors[campo.nombre]}
            value={formValues[fieldKey] || ''}
            onChange={(e) => handleChange(e.target.value || 0)}
          />
        );
      
      case 'TEXTO':
      default:
        { const isRFC = campo.nombre.toLowerCase().includes('rfc');
          
        return (
          <TextField 
            error={!!fieldErrors[campo.nombre]}
            helperText={fieldErrors[campo.nombre]}
            {...commonProps}
            value={formValues[fieldKey] || ''}
            
            onInput={(e) => {
              if (campo.soloMayusculas) {
                const input = e.currentTarget as HTMLInputElement;
                input.value = input.value.toUpperCase();
              }
            }}
            inputProps={{ maxLength: isRFC ? 13 : undefined }}
            onChange={(e) => {
              const value = isRFC ? (e.target.value || '').toUpperCase() : (e.target.value || '');
              if (isRFC) e.target.value = value;
              handleChange(value);
            }}
          />
        ); }
    }
    }

    const renderForm = () => {
        if (loadingCampos) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                </Box>
            );
        }

        return(
        <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        {camposFacturacion?.campos.map((campo) => (
            <FormControl key={campo.nombre}>
            <Box key={campo.nombre}>
                {getFieldInput(campo)}
                
                </Box>
            </FormControl>
        ))}
        <Button type="submit" loading={loading} fullWidth variant="contained">
          Buscar Factura
        </Button>
      </Box>
    )


    }
    return(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card variant='outlined'>
          <Button
          startIcon={<ArrowBackIcon fontSize={'large'} />}
          variant='text'
          onClick={onBack}
          >
              <Typography variant="subtitle1" >Volver al inicio de sesión</Typography>
          </Button>
          <Divider/>
            <Typography variant="h5" sx={{  mt: 1, fontWeight: 600 }}>Completa los datos</Typography>
          {renderForm()}
          {renderTagError()}
          {renderConfiguracionInvalida()}
          {renderTagErrorInterno()}
        </Card>
      </LocalizationProvider>
    )
}