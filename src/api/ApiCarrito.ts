import { API_ENDPOINTS } from "./config";
import { apiToken } from "./ApiToken";
import type { CarroItem } from "../types/CarritoInterface";
import type { Publicacion } from "@/types/PedidosInterface";
import { errorHandler } from "./errorHandler";
// api/ApiCarrito.ts
class ApiCarrito {  
    private baseUrl: string;

    constructor(baseUrl: string = API_ENDPOINTS.carrito) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        expectJson: boolean = true // Nuevo parámetro
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

        // Si no esperamos JSON o si la respuesta está vacía, retornar null
        if (!expectJson || response.status === 204 || !response.headers.get('content-type')?.includes('application/json')) {
            return null as T;
        }

        // Verificar si hay contenido antes de parsear JSON
        const text = await response.text();
        if (!text) {
            return null as T;
        }

        try {
            return JSON.parse(text);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return null as T;
        }
    }

    async getPublicacionesCarro(carroItems: CarroItem[]): Promise<Map<number, Publicacion>> {
        const response = await this.request<Record<number, Publicacion>>('/publicaciones',{
            method: 'POST',
            body: JSON.stringify(carroItems)
        });
        return new Map(Object.entries(response).map(([key, value]) => [Number(key), value]));
    }
    async getIva(): Promise<number> {
        return this.request<number>('/IVA');
    }

}

export const apiCarrito = new ApiCarrito();