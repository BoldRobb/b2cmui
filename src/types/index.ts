export interface User {
  id?: number;
  subject: string;
  role: 'admin' | 'user';
}


export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface DashboardStats {
  activeUsers: number;
  salesThisMonth: number;
  revenue: number;
  invoicesIssued: number;
}

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  children?: MenuItem[];
}

export interface DatosCorreo {
  destinatarios: string;
  asunto: string;
  mensaje: string;
  cc: string;
  cco: string;
}

export interface Historial {
  id: number;
  fecha: Date;
  descripcion: string;
}
export interface HistorialResponsePaginada {
  content: Historial[];
  totalPages: number;
  last: boolean;
  size: number;
  first: boolean;
  number: number;
  totalElements: number;
}