
export interface Orden {
    id: number;
    total: number;
    id_externo: string;
    estatus: string;
    id_comprador_externo: string;
    fecha_creacion: Date;
    detalles: OrdenDetalle[];
    centro_comercio_id: number;
    venta_id: number;
    pedido: PedidoOrden;
}

export interface OrdenDetalle {
    id: number;
    id_publicacion_externa: string;
    cantidad: number;
    publicacion_id: number;
    publicacion?: PedidoOrden; 
}

export interface OrdenResponsePaginada {
    content: Orden[];
    totalPages: number;
  last: boolean;
  size: number;
  first: boolean;
  number: number;
  totalElements: number;
}
export interface PedidoOrden{
    id: number;
    fecha: Date;
    fecha_creacion: Date;
    fecha_modificacion: Date;
    folio: string;
    importe_bruto: number;
    importe: number;
    iva: number;
    total: number;
    total_neto: number;
    entregado: boolean;
    sucursal_id: number;
    cliente_id: number;
    almacen_id: number;
    vendedor_id: number;
    usuario_id: number;
} 