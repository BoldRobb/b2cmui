import type { Cliente, EstadisticaCliente } from "./ClienteInterfaces";

export interface DashboardData {
    cliente?: Cliente;
    direccionCliente?: string;
    estadisticaCliente?: EstadisticaCliente;
    columnasVencimientos: Record<string, string>;
    diasMaximosVencimiento: Record<string, number>;
}