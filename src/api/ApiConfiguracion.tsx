
import { API_ENDPOINTS } from "./config";
import type { AppInfo, ConfiguracionFacturacion, ConfiguracionGeneral, GuardarConfiguracionResponse, InfoCamposFacturacion } from "../types/ConfiguracionInterface";
import { apiToken } from "./ApiToken";
import { errorHandler } from "./errorHandler";

class ApiConfiguracion {
  private baseUrl: string;

  constructor(baseUrl: string = API_ENDPOINTS.configuracion) {
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
      const errorMessage = `API Error: ${response.status} ${response.statusText}`;
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

    async getGeneral(): Promise<ConfiguracionGeneral> {
      return this.request<ConfiguracionGeneral>('/general');
    }

    async getFacturacion(): Promise<ConfiguracionFacturacion> {
      return this.request<ConfiguracionFacturacion>('/facturacion');
    }

    async getInfoCamposFacturacion(): Promise<InfoCamposFacturacion> {
      return this.request<InfoCamposFacturacion>('/facturacion/campos');
    }

    async saveGeneral(config: ConfiguracionGeneral): Promise<GuardarConfiguracionResponse> {
      return this.request<GuardarConfiguracionResponse>('/general', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    }

    async saveFacturacion(config: ConfiguracionFacturacion): Promise<GuardarConfiguracionResponse> {
      return this.request<GuardarConfiguracionResponse>('/facturacion', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    }

    async getAppInfo(): Promise<AppInfo> {
      const info = await this.request<AppInfo>('/app-info');
      return info;
    }

    

}
export const apiConfiguracion = new ApiConfiguracion();