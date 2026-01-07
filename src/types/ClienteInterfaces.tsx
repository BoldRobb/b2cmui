import type { Vencimiento } from "./VencimientosInterface";

export interface Cliente{
  id: number;
  clave: string;
  nombre: string;
  rfc: string;
  usoCfdi: string;
  calle: string;
  ciudad: string;
  estado: string;
  municipio: string;
  pais: string;
  codigo_postal: string;
  colonia: string;
  numero_exterior: string;
  numero_interior: string;
  monedaId: number;
  activo: boolean;
  precioPorDefecto: number;
  prioridadCobranza: string;
  restringir_precios: boolean;
  persona_fisica: boolean;
  giro_cliente_id: number;
  tipo_cliente_id: number;
  control_saldo: string;
  regimen_fiscal: string;
  nombre_fiscal: string;
  vendedor_id: number;
  zona_id: number;
  clienteContactos: ClienteContacto[];
  relacionCuentaContables: ClienteRelacionCuentaContable[];
  clienteParametros: ClienteParametro;
  clienteParametrosPortal: ClienteParametrosPortal;

}
export interface ClienteContacto{
  id: number;
  nombre: string;
  correo: string;
  tipoTelefono: string;
  clienteId: number;
}
export interface ClienteParametro{
  id: number;
  paramImportacionLocal: boolean;
  paramRetenciones: string;
  paramRecencionIva: string;
  paramRetencionIsr: string;
}
export interface ClienteParametrosPortal{
  acceso: boolean;
  contrasena: string;
  almacenId: number;
  sucursalId: number;

}
export interface ClienteRelacionCuentaContable{
  id: number;
  monedaId: number;
  cuentaId: number;
  cuentaComplementariaId: number;
  clienteId: number;
}
export interface EstadisticaCliente{
  saldoActual: number;
  limiteCredito: number;
    vencimientos: Vencimiento[];
}
export interface GiroCliente{
  id: number;
  clave: string;
  nombre: string;
  activo: boolean;
}
export interface TipoCliente{
  id: number;
  clave: string;
  nombre: string;
}