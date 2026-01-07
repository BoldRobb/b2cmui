import { API_ENDPOINTS } from "./config";
import type { HistorialResponsePaginada } from "@/types";
import { apiToken } from "./ApiToken";
import { errorHandler } from "./errorHandler";

class ApiHistorial {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_ENDPOINTS.historial;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const token = apiToken.getToken();
        
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }), // Solo agregar si existe
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorMessage = `API Error: ${response.status} ${response.statusText}`;
            errorHandler.handleConnectionError(response, errorMessage);
            console.error('Error en la respuesta:', response.status, response.statusText);
            throw new Error(errorMessage);
        }
        
        return response.json();
    }


    async getHistorial(page: number, size: number): Promise<HistorialResponsePaginada> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());
        const query = `?${params.toString()}`;
        return this.request<HistorialResponsePaginada>(`/all${query}`, {
            method: 'GET'
        });
    }


};
export const apiHistorial = new ApiHistorial();