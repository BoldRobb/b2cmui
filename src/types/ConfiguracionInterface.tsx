import type { GiroCliente, TipoCliente } from "./ClienteInterfaces";

export interface ConfiguracionGeneral {
    nombreAplicacion: string;
    claveCentroComercio: string;
    claveIva: string;
    usuarioAdministrador: string;
    contrasenaAdministrador: string;
}

export interface ConfiguracionFacturacion{
    camposFacturacion: CamposFacturacion[];
    permitirRfcGenerico: boolean;
    solicitarDiasVigencia: boolean;
    diasVigencia: number;
    usarDiaDeCorte: boolean;
    restringirFormaDePago: boolean;
    diaDeCorte: number;
    clientesNuevos: ClientesNuevos;
    estiloFormularioFacturacion: 'CLARO' | 'OSCURO';
}

export interface GuardarConfiguracionResponse {
    success: boolean,
    message: string,
}

export interface CamposFacturacion{
    id: string;
    nombre: string;
    seleccionado: boolean;
    tipo: 'ADICIONAL' | 'NORMAL';
    tipoCaptura: 'TEXTO' | 'NUMERO' | 'FECHA' ;
    value ?: string | number;
}

export interface ClientesNuevos{
    codigo: string;
    claveGiro: string;
    claveTipo: string;
    claveZona: string;
    controlDeSaldo: string;
    cuentaContable: string;
    claveVendedor: string;
}

export interface InfoCamposFacturacion{
    adicionalesVentas: TipoAdicional[];
    girosClientes: GiroCliente[];
    tiposClientes: TipoCliente[];
}

export interface TipoAdicional{
    id: number;
    clave: number;
    descripcion: string;
    cantidad_digitos: number;
    tipo_control: TipoControl;
    clasificacion: string;

}
export interface AppInfo {
      'app.name': string;
      'app.version': string;
    }

export type TipoControl =
    | 'NUMERICO'
    | 'PORCENTAJE'
    | 'FECHA'
    | 'ALFANUMERICO'
    | 'BOLEANO'
    | 'ENTERO';
