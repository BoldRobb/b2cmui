export interface CarroItem {
    id: number;
    cantidad: number;
    publicacionId: number;
    usuarioId: number;

}

export interface CarroResponse{
    exito: boolean;
    mensaje: string;
    tipo: "agregado" | "excedido" | "error";
    datos: unknown;
}