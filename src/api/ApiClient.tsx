import type { Cliente, EstadisticaCliente } from "../types/ClienteInterfaces";
import { API_ENDPOINTS } from "./config";
import { apiToken } from "./ApiToken";
import { errorHandler } from "./errorHandler";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_ENDPOINTS.cliente) {
    this.baseUrl = baseUrl;
  }


    private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    responseType: 'json' | 'text' = 'json'
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = apiToken.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
                    
                    
                    let errorMessage = await response.text();
                   
                    try {
                        const errorData = await response.json();
                        
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (errorData.error) {
                            errorMessage = errorData.error;
                        }
                    } catch {
                        // Si no se puede parsear el JSON, usar el mensaje por defecto
                    }
                    errorHandler.handleConnectionError(response, errorMessage);
                    throw new Error(errorMessage);
                }
    
    if (responseType === 'text') {
      const textResponse = await response.text();
      return textResponse as unknown as T;
    } else {
      const jsonResponse = await response.json();
      return jsonResponse;
    }

  }

  async getCliente(): Promise<Cliente> {
    return this.request<Cliente>('/token');
  }

  async getEstadisticasCliente(): Promise<EstadisticaCliente> {
    return this.request<EstadisticaCliente>('/estadisticas');
  }
  

  async getDireccionCliente(): Promise<string> {
    try {
      return this.request<string>('/direccion', {}, 'text');
    } catch (error) {
      console.error('Error al obtener dirección del cliente:', error);
      return 'Dirección no disponible'; 
    }
  }
  
  async getDiasMaximosVencimiento(): Promise<Record<string, number>> {
    try {
      return this.request<Record<string, number>>('/dias-vencimiento');
    } catch (error) {
      console.error('Error al obtener días máximos de vencimiento:', error);
      return {}; 
    }
  }

  async getColumnasVencimientos(): Promise<Record<string, string>> {
    try {
      return this.request<Record<string, string>>('/columnas-vencimiento');
    } catch (error) {
      console.error('Error al obtener columnas de vencimientos:', error);
      return {}; 
    }
  }

  async getDashboardData(): Promise<{
    cliente: Cliente;
    direccionCliente: string;
    estadisticaCliente: EstadisticaCliente;
    columnasVencimientos: Record<string, string>;
    diasMaximosVencimiento: Record<string, number>;
  }> {
    const [cliente, direccionCliente, estadisticaCliente, columnasVencimientos, diasMaximosVencimiento] = await Promise.all([
      this.getCliente(),
      this.getDireccionCliente(),
      this.getEstadisticasCliente(),
      this.getColumnasVencimientos(),
      this.getDiasMaximosVencimiento()
    ]);

    return {
      cliente,
      direccionCliente,
      estadisticaCliente,
      columnasVencimientos,
      diasMaximosVencimiento
    };
  }
}

export const apiClient = new ApiClient();