import type { DocumentoEstatus } from "./DocumentosInterface";



export interface DocumentoDetallado {
    id: number;
    fecha: string;
    folio: string;
    estatus: DocumentoEstatus;
    total: number;
    importe: number;
    iva: number;
    partidas: DocumentoDetalladoPartida[];
}

export interface DocumentoDetalladoPartida{
    id: number;
    cantidad: number;
    precio: number;
    publicacion: Publicacion;
    articulo: Articulo;
}
export interface DocumentoDetalladoResponsePaginada {
  content: DocumentoDetallado[];
  totalPages: number;
  last: boolean;
  size: number;
  first: boolean;
  number: number;
  totalElements: number;
}

export interface Articulo{
    id: number;
    clave: string;
    nombre: string;
    existencia: boolean;
    cantidad: number;
    clasificacionId: number;
    existencias: ArticuloExistencia[];
    preciosPorMoneda: ArticuloPrecio[];
    codigoSat: string;
}
export interface PublicacionResponsePaginada {
  content: Publicacion[];
  totalPages: number;
  last: boolean;
  size: number;
  first: boolean;
  number: number;
  totalElements: number;
}
export interface Publicacion{
    id: number;
    titulo: string;
    descripcion: string;
    cantidad: number;
    precio: number;
    categoria: string;
    enlace: string;
    imagenes: string[];
    articuloId: number;
    almacenId: number;
    tipoExistencia: TipoExistencia;
    idExterno: string;
    estatus: EstatusPublicacion;
    atributos: Map<string, string>;
}

export interface ArticuloExistencia{
    id: number;
    cantidad_existencia: number;
    valor: number;
    almacenId: number;
    nombre_almacen: string;
    articuloId: number;
}

export interface ArticuloPrecio {

    id: number;
    orden: number;
    invArticuloId: number;
    precio: number;
    margen: number;
    monedaId: number;

}
export const TipoExistencia = {
  
    manual: "MANUAL",
    almacen_especifico: "ALMACEN_ESPECIFICO",
    total: "TOTAL",
    almacen_dinamico: "ALMACEN_DINAMICO"
} as const;

export const EstatusPublicacion = {
    SIN_PUBLICAR: "SIN_PUBLICAR",
    PUBLICADO: "PUBLICADO",
    DESACTUALIZADO: "DESACTUALIZADO",
    DESHABILITADO: "DESHABILITADO"
} as const;
export type EstatusPublicacion = typeof EstatusPublicacion[keyof typeof EstatusPublicacion];
export type TipoExistencia = typeof TipoExistencia[keyof typeof TipoExistencia];