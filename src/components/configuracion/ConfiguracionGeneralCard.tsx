import { Box, Button, Card, Divider, FormControl, FormLabel, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { apiConfiguracion } from "../../api/ApiConfiguracion";
import { notificationService } from "../../services/notificationService";
import { apiToken } from "../../api/ApiToken";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { ConfiguracionGeneral } from "../../types/ConfiguracionInterface";
import { useDocumentTitle } from "../../hooks/useTitle";

export default function ConfiguracionGeneralCard(){

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [originalAdminCredentials, setOriginalAdminCredentials] = useState('');
    const [nombreAplicacionError, setNombreAplicacionError] = useState(false);
    const [nombreAplicacionErrorMessage, setNombreAplicacionErrorMessage] = useState('');
    const [claveCentroComercioError, setClaveCentroComercioError] = useState(false);
    const [claveCentroComercioErrorMessage, setClaveCentroComercioErrorMessage] = useState('');
    const [claveIvaError, setClaveIvaError] = useState(false);
    const [claveIvaErrorMessage, setClaveIvaErrorMessage] = useState('');
    const [usuarioAdmin, setUsuarioAdmin] = useState('');
    const [usuarioAdminError, setUsuarioAdminError] = useState(false);
    const [usuarioAdminErrorMessage, setUsuarioAdminErrorMessage] = useState('');
    const [contrasenaAdmin, setContrasenaAdmin] = useState('');
    const [contrasenaAdminError, setContrasenaAdminError] = useState(false);
    const [contrasenaAdminErrorMessage, setContrasenaAdminErrorMessage] = useState('');
    const [nombreAplicacion, setNombreAplicacion] = useState('');
    const [claveCentroComercio, setClaveCentroComercio] = useState('');
    const [claveIva, setClaveIva] = useState('');

    const { recargarTituloDesdeServidor } = useDocumentTitle();
    


    useEffect(() => {
      console.log('Cargando configuración general...');
            loadConfiguracion();
        }, []);

    const loadConfiguracion = async () => {
        try {
            const generalConfig = await apiConfiguracion.getGeneral();

            if (generalConfig) {
                setNombreAplicacion(generalConfig.nombreAplicacion);
                setClaveCentroComercio(generalConfig.claveCentroComercio);
                setClaveIva(generalConfig.claveIva);
                setUsuarioAdmin(generalConfig.usuarioAdministrador);
                setContrasenaAdmin(generalConfig.contrasenaAdministrador);
                // Guardar las credenciales originales en base64
                setOriginalAdminCredentials(
                    btoa(`${generalConfig.usuarioAdministrador}:${generalConfig.contrasenaAdministrador}`)
                );
            } else {
                setOriginalAdminCredentials('');
            }

        } catch (error) {
            console.error('Error al cargar configuración:', error);
            notificationService.error('Error al cargar la configuración');
        }
    };


      const handleLogout = () => {
        apiToken.removeToken();
        queryClient.clear();
        navigate('/login?logout=true');
    };

    const validateInputs = () => {
    const nombreAplicacion = document.getElementById('nombreAplicacion') as HTMLInputElement;
    const claveCentroComercio = document.getElementById('claveCentroComercio') as HTMLInputElement;
    const claveIva = document.getElementById('claveIva') as HTMLInputElement;
    const usuarioAdministrador = document.getElementById('usuarioAdministrador') as HTMLInputElement;
    const contrasenaAdministrador = document.getElementById('contrasenaAdministrador') as HTMLInputElement;

    let isValid = true;

    if (!nombreAplicacion.value) {
      setNombreAplicacionError(true);
      setNombreAplicacionErrorMessage('Por favor ingrese el nombre de la aplicación.');
      isValid = false;
    } else {
      setNombreAplicacionError(false);
      setNombreAplicacionErrorMessage('');
    }

    if (!claveCentroComercio.value ) {
      setClaveCentroComercioError(true);
      setClaveCentroComercioErrorMessage('Por favor ingrese la clave del centro de comercio.');
      isValid = false;
    } else {
      setClaveCentroComercioError(false);
      setClaveCentroComercioErrorMessage('');
    }

    if (!claveIva.value ) {
      setClaveIvaError(true);
      setClaveIvaErrorMessage('Por favor ingrese la clave del IVA.');
      isValid = false;
    } else {
      setClaveIvaError(false);
      setClaveIvaErrorMessage('');
    }

    if (!usuarioAdministrador.value ) {
      setUsuarioAdminError(true);
      setUsuarioAdminErrorMessage('Por favor ingrese el usuario administrador.');
      isValid = false;
    } else {
      setUsuarioAdminError(false);
      setUsuarioAdminErrorMessage('');
    }

    if (!contrasenaAdministrador.value ) {
      setContrasenaAdminError(true);
      setContrasenaAdminErrorMessage('Por favor ingrese la contraseña del administrador.');
      isValid = false;
    } else {
      setContrasenaAdminError(false);
      setContrasenaAdminErrorMessage('');
    }


    return isValid;
  };

    const handleSubmitGeneral = async () => {
        if (!validateInputs()) {
            return;
        }

        const values: ConfiguracionGeneral = {
            nombreAplicacion: (document.getElementById('nombreAplicacion') as HTMLInputElement).value,
            claveCentroComercio: (document.getElementById('claveCentroComercio') as HTMLInputElement).value,
            claveIva: (document.getElementById('claveIva') as HTMLInputElement).value,
            usuarioAdministrador: (document.getElementById('usuarioAdministrador') as HTMLInputElement).value,
            contrasenaAdministrador: (document.getElementById('contrasenaAdministrador') as HTMLInputElement).value,
        };

        const adminCredentialsChanged = originalAdminCredentials
            !== btoa(`${values.usuarioAdministrador}:${values.contrasenaAdministrador}`);

        try {
            const response = await apiConfiguracion.saveGeneral(values);
            if (response.success) {
                notificationService.success('Configuración general guardada exitosamente');
                await recargarTituloDesdeServidor();
                if (adminCredentialsChanged) {
                    notificationService.info('Las credenciales de administrador han sido actualizadas. Por favor, vuelve a iniciar sesión.');

                    setTimeout(() => {
                        handleLogout();
                        
                    }, 4000);
                }
            } else {
                notificationService.error('Error al guardar la configuración general');
            }
        } catch (error) {
            console.error('Error al guardar configuración general:', error);
            notificationService.error('Error al guardar la configuración general');
        }
    };

    return(
        <Card sx={{ p: 3 }}>
            <Typography variant="h5">Portal</Typography>
            <FormControl fullWidth>
              <FormLabel htmlFor="nombreAplicacion">Nombre de la aplicación</FormLabel>
              <TextField
                error={nombreAplicacionError}
                helperText={nombreAplicacionErrorMessage}
                id="nombreAplicacion"
                type="text"
                name="nombreAplicacion"
                value={nombreAplicacion}
                onChange={(e) => setNombreAplicacion(e.target.value)}
                placeholder="Nombre de la aplicación"
                autoComplete="nombreAplicacion"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={nombreAplicacionError ? 'error' : 'primary'}
              />
            </FormControl>
          
        <Divider sx={{my:2}}/>
        <Typography variant="h5">Configuración de Ecommerce</Typography>
        <Stack  direction="row" spacing={2} sx={{mt:2}}>
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth>
            <FormLabel htmlFor="claveCentroComercio">Clave centro comercio</FormLabel>
            <TextField
              error={claveCentroComercioError}
              helperText={claveCentroComercioErrorMessage}
              id="claveCentroComercio"
              type="text"
              name="claveCentroComercio"
              value ={claveCentroComercio}
              onChange={(e) => setClaveCentroComercio(e.target.value)}
              placeholder="Clave "
              autoComplete="claveCentroComercio"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={claveCentroComercioError ? 'error' : 'primary'}
            />
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth>
            <FormLabel htmlFor="claveIva">Clave IVA</FormLabel>
            <TextField
              error={claveIvaError}
              helperText={claveIvaErrorMessage}
              id="claveIva"
              type="text"
              name="claveIva"
              placeholder="Clave"
              autoComplete="claveIva"
              value= {claveIva}
              onChange={(e) => setClaveIva(e.target.value)}
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={claveIvaError ? 'error' : 'primary'}
            />
          </FormControl>
        </Box>
          
        </Stack>
        <Divider sx={{my:2}}/>
        <Typography variant="h5">Credenciales de administrador</Typography>
        <Stack  direction="row" spacing={2} sx={{mt:2}}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <FormLabel htmlFor="usuarioAdministrador">Usuario administrador</FormLabel>
                <TextField
                  error={usuarioAdminError}
                  helperText={usuarioAdminErrorMessage}
                  id="usuarioAdministrador"
                  type="text"
                  name="usuarioAdministrador"
                  placeholder="Usuario"
                  autoComplete="usuarioAdministrador"
                  autoFocus
                  value={usuarioAdmin}
                  onChange={(e) => setUsuarioAdmin(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  color={usuarioAdminError ? 'error' : 'primary'}
                />
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <FormLabel htmlFor="contrasenaAdministrador">Contraseña administrador</FormLabel>
                <TextField
                  error={contrasenaAdminError}
                  helperText={contrasenaAdminErrorMessage}
                  id="contrasenaAdministrador"
                  type="password"
                  name="contrasenaAdministrador"
                  placeholder="Contraseña"
                  autoComplete="contrasenaAdministrador"
                  value={contrasenaAdmin}
                  onChange={(e) => setContrasenaAdmin(e.target.value)}
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={contrasenaAdminError ? 'error' : 'primary'}
                />
              </FormControl>
            </Box>
            
          
        </Stack>
        <Button fullWidth variant="contained" sx={{mt:3}} onClick={handleSubmitGeneral}>Guardar cambios</Button>
        </Card>
    )
}