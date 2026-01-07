import type { LoginRequest, LoginResponse } from "../types/LoginInterfaces";
import { API_ENDPOINTS } from "./config";
import { apiToken } from "./ApiToken";
import { errorHandler } from "./errorHandler";

class ApiAuth {
  private baseUrl: string;

  constructor(baseUrl: string = API_ENDPOINTS.auth) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
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
                
                let errorMessage = `API Error: ${response.status} ${response.statusText}`;
                
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
                console.error('Error en la respuesta:', response.status, errorMessage);
                throw new Error(errorMessage);
            }

    return response.json();
  }

  // Métodos de autenticación
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  

}

export const apiAuth = new ApiAuth();