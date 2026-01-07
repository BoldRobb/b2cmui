import type { Cliente } from "./ClienteInterfaces";
import type { CamposFacturacion } from "./ConfiguracionInterface";
import { DocumentoEstatus } from "./DocumentosInterface";
import type { Articulo } from "./PedidosInterface";
import type { RegimenFiscalType, FormaPagoType  } from "./FacturacionEnums";
export interface formularioBuscar{
    campos: CamposFacturacion[];
}

export interface MetadatosFacturacionBuscada{

    folio: string;
    fecha: string; //formato yyyy-MM-dd
    total: number;
    rfc: string;
    razonSocial: string;
    adicionales: Map<string, string>;
}
export interface FormularioConfigurable{
    campos: CampoConfigurable[];
}

export interface CampoConfigurable{
    id: string;
    nombre: string;
    tipoCaptura: 'TEXTO' | 'NUMERO' | 'FECHA' ;
    valor: string ;
    soloMayusculas: boolean ;

}

export interface RespuestaBusquedaFactura{
    success: boolean;
    folio?: string;
    metadatos?: MetadatosFacturacionBuscada;
    error?: string;
    errorTimbrado?: string;
    correo?: CorreoResponse;
}

export interface CorreoResponse{
    enviado: boolean;
    error?: string;
}
export interface DatosFiscales{
    rfc: string;
    claveRegimenFiscal: string;
    usoCfdi: string;
    razonSocial: string;
    nombreFiscal: string;
    claveFormaPago: string;
}

export interface DatosDireccion{
    calle: string;
    numeroInterior: string;
    numeroExterior: string;
    colonia: string;
    ciudad: string;
    codigoPostal: string;
    municipio: string;
    estado: string;
}
export interface FormularioFacturar{
    datosFiscales: DatosFiscales;
    datosDireccion: DatosDireccion;
    correo: string;
    folio: string;
    valid: boolean;
}

export interface FacturaModel{
    factura: DatosDocumentoFacturable;
    empresa: Empresa;
    regimenFiscal: string;
    usoCfdi: string;
    formaPago: FormaPagoType;
}

export interface FormularioFacturarModel{
    documento: DatosDocumentoFacturable;
    regimenesFiscales: RegimenFiscalType[];
    usosCfdiPorRegimenes: Record<string, string[]>;
    formasPago: FormaPagoType[];
    empresa: Empresa;
    estados: string[];
    usosCfdi: Map<string, UsoCfdiDTO>;
    deshabilitarCapturaFormaDePago: boolean;
}

export interface PartidaDocumentoFacturable{
     id: number;
    articulo: Articulo;
       cantidad: number; 
       precio: number; 
       importe: number;
}
export interface DatosDocumentoFacturable{
    id: number;
    folio: string; 
    fecha: Date;
    subtotal: number;
    ieps: number;
    iva: number;
    total: number;
    estatus: DocumentoEstatus;
    tipoOperacionId: number;
    diasCredito: number;
    cliente: Cliente;
    moneda: Moneda;
    partidas: PartidaDocumentoFacturable[];
    formaPago: string;
}

export interface Empresa{
    id: number;
    razon_social: string;
    nombre_comercial: string;
    rfc: string;
    regimen_fiscal: string;
    calle: string;
    ciudad: string;
    municipio: string;
    estado: string;
    pais: string;
    codigo_pais: string;
    codigo_estado: string;
    codigo_postal: string;
    colonia: string;
    numero_exterior: string;
    numero_interior: string;
}

export interface UsoCfdiDTO{
    clave: string;
    descripcion: string;
}
export interface Moneda{
    id: number;
    clave: string;
    nombre: string;
    tipoCambio: number;
    claveMonedaSAT: string;
    monedaDefault: boolean;
    activo: string;
    abreviatura: string;
}