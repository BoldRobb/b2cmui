import { Box, Button, Card, Divider, FormControl, FormLabel, Stack, TextField, Typography, Switch, FormControlLabel, Select, MenuItem, Grid, CircularProgress } from "@mui/material"
import { useState, useEffect } from "react";
import type { ConfiguracionFacturacion, InfoCamposFacturacion } from "../../types/ConfiguracionInterface";
import { apiConfiguracion } from "../../api/ApiConfiguracion";
import { notificationService } from "../../services/notificationService";

export default function ConfiguracionFacturacionCard(){
    
    const [infoCampos, setInfoCampos] = useState<InfoCamposFacturacion>();
    const [facturacionConfig, setFacturacionConfig] = useState<ConfiguracionFacturacion>();
    
    // Estados para los campos del formulario
    const [permitirRFCGenerico, setPermitirRFCGenerico] = useState(false);
    const [diasVigencia, setDiasVigencia] = useState('');
    const [solicitarDiasVigencia, setSolicitarDiasVigencia] = useState(false);
    const [usarDiaCorte, setUsarDiaCorte] = useState(false);
    const [diaCorte, setDiaCorte] = useState('');
    const [codigo, setCodigo] = useState('');
    const [claveGiro, setClaveGiro] = useState('');
    const [claveTipo, setClaveTipo] = useState('');
    const [restringirFormaDePago, setRestringirFormaDePago] = useState(false);
    const [controlDeSaldo, setControlDeSaldo] = useState('');
    const [cuentaContable, setCuentaContable] = useState('');
    const [claveVendedor, setClaveVendedor] = useState('');
    const [claveZona, setClaveZona] = useState('');
    
    const [loading, setLoading] = useState(false);

    // Estados para errores
    const [errors, setErrors] = useState({
        camposFacturacion: '',
        codigo: '',
        claveGiro: '',
        claveTipo: '',
        controlDeSaldo: '',
        cuentaContable: '',
        claveVendedor: '',
        claveZona: '',
        diasVigencia: '',
        diaCorte: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    loadConfiguracion(),
                    loadCamposFacturacion()
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const loadConfiguracion = async () => {
        try {
            const facturacionConfig = await apiConfiguracion.getFacturacion();

            if (facturacionConfig) {
                setFacturacionConfig(facturacionConfig);
                setPermitirRFCGenerico(facturacionConfig.permitirRfcGenerico || false);
                setDiasVigencia(facturacionConfig.diasVigencia?.toString() || '');
                setSolicitarDiasVigencia(facturacionConfig.solicitarDiasVigencia || false);
                setUsarDiaCorte(facturacionConfig.usarDiaDeCorte || false);
                setDiaCorte(facturacionConfig.diaDeCorte?.toString() || '');
                setCodigo(facturacionConfig.clientesNuevos?.codigo || '');
                setClaveGiro(facturacionConfig.clientesNuevos?.claveGiro || '');
                setClaveTipo(facturacionConfig.clientesNuevos?.claveTipo || '');
                setRestringirFormaDePago(facturacionConfig.restringirFormaDePago || false);
                setControlDeSaldo(facturacionConfig.clientesNuevos?.controlDeSaldo || '');
                setCuentaContable(facturacionConfig.clientesNuevos?.cuentaContable || '');
                setClaveVendedor(facturacionConfig.clientesNuevos?.claveVendedor || '');
                setClaveZona(facturacionConfig.clientesNuevos?.claveZona || '');
            }
        } catch (error) {
            console.error('Error al cargar configuración:', error);
            notificationService.error('Error al cargar la configuración');
        }
    };


    const loadCamposFacturacion = async () => {
        try {
            const campos = await apiConfiguracion.getInfoCamposFacturacion();
            setInfoCampos(campos);
        } catch (error) {
            console.error('Error al cargar campos de facturación:', error);
            notificationService.error('Error al cargar los campos de facturación');
        }
    }

    const handleCampoChange = (campoId: string, checked: boolean) => {
        if (!facturacionConfig) return;
        
        const updatedCampos = facturacionConfig.camposFacturacion.map(campo => 
            campo.id === campoId 
                ? { ...campo, seleccionado: checked }
                : campo
        );
        
        setFacturacionConfig({
            ...facturacionConfig,
            camposFacturacion: updatedCampos
        });
    };

    const validateForm = (): boolean => {
        const newErrors = {
            camposFacturacion: '',
            codigo: '',
            claveGiro: '',
            claveTipo: '',
            controlDeSaldo: '',
            cuentaContable: '',
            claveVendedor: '',
            claveZona: '',
            diasVigencia: '',
            diaCorte: ''
        };

        let isValid = true;

        // Validar que al menos un campo esté seleccionado
        const alMenosUnCampoSeleccionado = facturacionConfig?.camposFacturacion?.some(
            campo => campo.seleccionado
        );

        if (!alMenosUnCampoSeleccionado) {
            newErrors.camposFacturacion = 'Debe tener al menos un campo de facturación seleccionado';
            isValid = false;
        }

        // Validar campos requeridos de clientes nuevos
        if (!codigo.trim()) {
            newErrors.codigo = 'El código es requerido';
            isValid = false;
        }

        if (!claveGiro) {
            newErrors.claveGiro = 'El giro es requerido';
            isValid = false;
        }

        if (!claveTipo) {
            newErrors.claveTipo = 'El tipo es requerido';
            isValid = false;
        }

        if (!controlDeSaldo) {
            newErrors.controlDeSaldo = 'El control de saldo es requerido';
            isValid = false;
        }

        if (!cuentaContable.trim()) {
            newErrors.cuentaContable = 'La cuenta contable es requerida';
            isValid = false;
        }

        if (!claveVendedor.trim()) {
            newErrors.claveVendedor = 'La clave del vendedor es requerida';
            isValid = false;
        }

        if (!claveZona.trim()) {
            newErrors.claveZona = 'La clave de zona es requerida';
            isValid = false;
        }

        // Validar días de vigencia si está habilitado
        if (solicitarDiasVigencia && (!diasVigencia || Number(diasVigencia) < 0 || Number(diasVigencia) > 90)) {
            newErrors.diasVigencia = 'Los días de vigencia deben estar entre 0 y 90';
            isValid = false;
        }

        // Validar día de corte si está habilitado
        if (usarDiaCorte && (!diaCorte || Number(diaCorte) < 0 || Number(diaCorte) > 31)) {
            newErrors.diaCorte = 'El día de corte debe estar entre 0 y 31';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        if (!facturacionConfig) {
            notificationService.error('No hay configuración cargada');
            return;
        }

        const configToSave: ConfiguracionFacturacion = {
            camposFacturacion: facturacionConfig.camposFacturacion,
            permitirRfcGenerico: permitirRFCGenerico,
            solicitarDiasVigencia: solicitarDiasVigencia,
            diasVigencia: solicitarDiasVigencia ? Number(diasVigencia) : 0,
            usarDiaDeCorte: usarDiaCorte,
            restringirFormaDePago: restringirFormaDePago,
            diaDeCorte: usarDiaCorte ? Number(diaCorte) : 0,
            clientesNuevos: {
                codigo: codigo,
                claveGiro: claveGiro,
                claveTipo: claveTipo,
                controlDeSaldo: controlDeSaldo,
                cuentaContable: cuentaContable,
                claveVendedor: claveVendedor,
                claveZona: claveZona
            },
            estiloFormularioFacturacion: facturacionConfig.estiloFormularioFacturacion || 'OSCURO'
        };

        try {
            const response = await apiConfiguracion.saveFacturacion(configToSave);
            if (response.success) {
                notificationService.success('Configuración de facturación guardada exitosamente');
                // Limpiar errores después de guardar exitosamente
                setErrors({
                    camposFacturacion: '',
                    codigo: '',
                    claveGiro: '',
                    claveTipo: '',
                    controlDeSaldo: '',
                    cuentaContable: '',
                    claveVendedor: '',
                    claveZona: '',
                    diasVigencia: '',
                    diaCorte: ''
                });
                // Recargar la configuración para reflejar los cambios guardados
                await loadConfiguracion();
            } else {
                notificationService.error(response.message || 'Error al guardar la configuración');
            }
        } catch (error) {
            console.error('Error al guardar configuración de facturación:', error);
            notificationService.error('Error al guardar la configuración de facturación');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return(
        <Card sx={{ p: 3 }}>
            <Typography variant="h5">Configuración de campos</Typography>
            <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                {facturacionConfig?.camposFacturacion?.map((campo) => (
                    <Grid size={4}>                   
                <FormControlLabel
                    key={campo.id}
                    control={
                        <Switch
                            checked={campo.seleccionado}
                            onChange={(e) => handleCampoChange(campo.id, e.target.checked)}
                            />
                    }
                    label={campo.nombre}
                />
                </Grid>
            ))}
            </Grid>
            {errors.camposFacturacion && (
                <Typography color="error" variant="body2" sx={{ mt: -1, mb: 2 }}>
                    {errors.camposFacturacion}
                </Typography>
            )}
            
            <Divider sx={{my:2}}/>
            <Typography variant="h5">Parámetros</Typography>
            
            <Stack direction="row" spacing={2} sx={{mt:2}}>
                <Stack direction="column" spacing={2} sx={{ flex: 1 }}>
                    <FormControlLabel
                    control={
                    <Switch 
                        checked={permitirRFCGenerico} 
                        onChange={(e) => setPermitirRFCGenerico(e.target.checked)}
                    />
                    }
                    label="Permitir RFC Genérico"
                    />

                <FormControlLabel
                control={
                  <Switch 
                    checked={restringirFormaDePago} 
                    onChange={(e) => setRestringirFormaDePago(e.target.checked)}
                  />
                }
                label="Restringir Forma de Pago"
              />
                    
                </Stack>

                <Stack direction="column" spacing={2} sx={{ flex: 1 }}>
                <FormControlLabel
                        control={
                        <Switch 
                            checked={solicitarDiasVigencia} 
                            onChange={(e) => setSolicitarDiasVigencia(e.target.checked)}
                        />
                        }
                        label="Solicitar Días de Vigencia"
                    />
                <FormControl fullWidth>
                    <FormLabel htmlFor="diasVigencia">Días de Vigencia</FormLabel>
                    <TextField
                    id="diasVigencia"
                    type="number"
                    name="diasVigencia"
                    disabled={!solicitarDiasVigencia}
                    value={diasVigencia}
                    onChange={(e) => setDiasVigencia(e.target.value)}
                    placeholder="Días"
                    fullWidth
                    variant="outlined"
                    error={!!errors.diasVigencia}
                    helperText={errors.diasVigencia}
                    />
              </FormControl>
                </Stack >
              
              
              <Stack direction="column" spacing={2} sx={{ flex: 1 }}>
                <FormControlLabel
                control={
                  <Switch 
                    checked={usarDiaCorte} 
                    onChange={(e) => setUsarDiaCorte(e.target.checked)}
                  />
                }
                label="Usar Día de Corte"
              />
              
              <FormControl fullWidth>
                <FormLabel htmlFor="diaCorte">Día de Corte</FormLabel>
                <TextField
                  id="diaCorte"
                  type="number"
                  name="diaCorte"
                  value={diaCorte}
                  disabled={!usarDiaCorte}
                  onChange={(e) => setDiaCorte(e.target.value)}
                  placeholder="Día"
                  fullWidth
                  variant="outlined"
                  error={!!errors.diaCorte}
                  helperText={errors.diaCorte}
                />
              </FormControl>
              </Stack>
              
              
              
            </Stack>
          
        <Divider sx={{my:2}}/>
        <Typography variant="h5">Alta de nuevos clientes</Typography>
        
        <Stack spacing={2} sx={{mt:2}}>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth error={!!errors.codigo}>
                <FormLabel htmlFor="codigo">Código</FormLabel>
                <TextField
                  id="codigo"
                  type="text"
                  name="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Código del cliente"
                  fullWidth
                  variant="outlined"
                  error={!!errors.codigo}
                  helperText={errors.codigo}
                />
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth error={!!errors.claveGiro}>
                <FormLabel htmlFor="claveGiro">Clave Giro</FormLabel>
                <Select
                  id="claveGiro"
                  name="claveGiro"
                  value={claveGiro}
                  onChange={(e) => setClaveGiro(e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="">Seleccionar...</MenuItem>
                  {infoCampos?.girosClientes
                    ?.map((giro) => (
                      <MenuItem key={giro.clave} value={giro.clave}>
                        {giro.nombre}
                      </MenuItem>
                    ))}
                </Select>
                {errors.claveGiro && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.claveGiro}
                  </Typography>
                )}
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth error={!!errors.claveTipo}>
                <FormLabel htmlFor="claveTipo">Clave Tipo</FormLabel>
                <Select
                  id="claveTipo"
                  name="claveTipo"
                  value={claveTipo}
                  onChange={(e) => setClaveTipo(e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="">Seleccionar...</MenuItem>
                  {infoCampos?.tiposClientes?.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.clave}>
                     {tipo.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.claveTipo && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.claveTipo}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
            <FormControl fullWidth error={!!errors.controlDeSaldo}>
            <FormLabel htmlFor="controlDeSaldo">Control de Saldo</FormLabel>
            <Select
              id="controlDeSaldo"
              name="controlDeSaldo"
              value={controlDeSaldo}
              onChange={(e) => setControlDeSaldo(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">Seleccionar...</MenuItem>
              <MenuItem value="ABIERTO">Abierto</MenuItem>
              <MenuItem value="LIMITADO">Limitado</MenuItem>
              <MenuItem value="CERRADO">Cerrado</MenuItem>
            </Select>
            {errors.controlDeSaldo && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.controlDeSaldo}
              </Typography>
            )}
          </FormControl>
          </Box>
            <Box sx={{ flex: 1 }}>
                
              <FormControl fullWidth error={!!errors.cuentaContable}>
                <FormLabel htmlFor="cuentaContable">Cuenta Contable</FormLabel>
                <TextField
                  id="cuentaContable"
                  type="text"
                  name="cuentaContable"
                  value={cuentaContable}
                  onChange={(e) => setCuentaContable(e.target.value)}
                  placeholder="Cuenta contable"
                  fullWidth
                  variant="outlined"
                  error={!!errors.cuentaContable}
                  helperText={errors.cuentaContable}
                />
              </FormControl>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth error={!!errors.claveVendedor}>
                <FormLabel htmlFor="claveVendedor">Clave Vendedor</FormLabel>
                <TextField
                  id="claveVendedor"
                  type="text"
                  name="claveVendedor"
                  value={claveVendedor}
                  onChange={(e) => setClaveVendedor(e.target.value)}
                  placeholder="Clave vendedor"
                  fullWidth
                  variant="outlined"
                  error={!!errors.claveVendedor}
                  helperText={errors.claveVendedor}
                />
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth error={!!errors.claveZona}>
                <FormLabel htmlFor="claveZona">Clave Zona</FormLabel>
                <TextField
                  id="claveZona"
                  type="text"
                  name="claveZona"
                  value={claveZona}
                  onChange={(e) => setClaveZona(e.target.value)}
                  placeholder="Clave zona"
                  fullWidth
                  variant="outlined"
                  error={!!errors.claveZona}
                  helperText={errors.claveZona}
                />
              </FormControl>
            </Box>
          </Stack>
          
          
        </Stack>
        
        <Button 
          fullWidth 
          variant="contained" 
          sx={{mt:3}}
          onClick={handleSubmit}
        >
          Guardar cambios
        </Button>
        </Card>
    )
}