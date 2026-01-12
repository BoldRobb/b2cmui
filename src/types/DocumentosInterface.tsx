
import type { Vencimiento } from "./VencimientosInterface";

export interface DocumentoResponse {
    id: number;
    fecha: string;
    folio: string;
    dias_credito: number;
    total: number;
    monto_aplicado: number;
    vencimientos: Vencimiento[];
    estatus: DocumentoEstatus;
    tipo_operacion_id: number;
    moneda_id: number;
    cliente_id: number;
    uso_cfdi: string;
    ieps: number;
    iva: number;
    importe: number;
    subTotal: number;
    entregado: boolean;
    tipo_cambio: number;
    forma_pago: string;
}

export interface Pago {
    id: number;
    fecha: string;
    folio: string;
    estatus: DocumentoEstatus;
    tipo_operacion_id: number;
    moneda_id: number;
    cliente_id: number;
    uso_cfdi: string;
    ieps: number;
    iva: number;
    monto_abono: number;
    monto_aplicado: number;
    sub_total_abono: number;
}
export interface DocumentosResponsePaginada {
  content: DocumentoResponse[];
  totalPages: number;
  last: boolean;
  size: number;
  first: boolean;
  number: number;
  totalElements: number;
}

export interface PagosResponsePaginada {
  content: Pago[];
  totalPages: number;
  last: boolean;
  size: number;
  first: boolean;
  number: number;
  totalElements: number;
}
export interface DocumentosQueryParams {
  page?: number;
  size?: number;
  sort?: string;
}

export const DocumentoEstatus = {
    ACTIVO: "ACTIVO",
    CANCELADO: "CANCELADO",
    DESAPLICADO: "DESAPLICADO",
    DETENIDO: "DETENIDO",
    SURTIDO: "SURTIDO",
    AGRUPADO: "AGRUPADO",
    APLICADO: "APLICADO",
    BORRADOR: "BORRADOR",
    AGREGADO: "AGREGADO",
    CONCILIADO: "CONCILIADO",
    PARCIALIDAD: "PARCIALIDAD",
    PARCIAL: "PARCIAL",
    FACTURADO: "FACTURADO",
    CERRADO: "CERRADO",
    REPUESTO: "REPUESTO",
    PROCESO: "PROCESO",
    TERMINADO: "TERMINADO",
    POSFECHADO: "POSFECHADO",
    REFERENCIADO: "REFERENCIADO"
} as const;
export const TipoDocumento = {
  CARGO: "CARGO",
  ABONO: "ABONO",
  FACTURASSERVICIOS: "FACTURASSERVICIOS",
  VENTAS: "VENTAS"
} as const;

export function formatearFecha(fecha: string | Date): string {
        return new Date(fecha).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
   };

   
export function formatearFechaHora(fecha: string): string {
        return new Date(fecha).toLocaleString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
   };

export function formatearMoneda(valor: number): string {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(valor);
    
    
   };
   

export type DocumentoEstatus = typeof DocumentoEstatus[keyof typeof DocumentoEstatus];
export type TipoDocumento = typeof TipoDocumento[keyof typeof TipoDocumento];
