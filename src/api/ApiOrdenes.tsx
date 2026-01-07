import { API_ENDPOINTS } from "./config";
import type { Orden, OrdenResponsePaginada } from "@/types/OrdenesInterface";
import { apiToken } from "./ApiToken";
import type { DocumentosQueryParams } from "@/types/DocumentosInterface";
import type { Publicacion } from "@/types/PedidosInterface";
import type { CarroItem } from "@/types/CarritoInterface";
import { errorHandler } from "./errorHandler";

class ApiOrdenes{
    private baseUrl: string;
    constructor() {
        this.baseUrl = API_ENDPOINTS.ordenes;
    }

   private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        // Obtener el token ANTES de construir los headers
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
        
        // Verificar si hay contenido antes de parsear JSON
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        
       
        if (contentLength === '0' || response.status === 204) {
            return undefined as T;
        }
        
        
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            return (text || undefined) as T;
        }
        
        
        const text = await response.text();
        if (!text || text.trim() === '') {
            return undefined as T;
        }
        
        try {
            return JSON.parse(text);
        } catch (error) {
            console.error('Error parsing JSON:', error, 'Response text:', text);
            throw new Error(`Invalid JSON response: ${text}`);
        }
    }

    async getOrdenes( queryParams: DocumentosQueryParams): Promise<OrdenResponsePaginada> {
        const params = new URLSearchParams();
        if (queryParams.page !== undefined) {
            params.append('page', queryParams.page.toString());
        }
        else {
            params.append('page', '0'); 
        }
        if (queryParams.size !== undefined) {
            params.append('size', queryParams.size.toString());
        }
        else {
            params.append('size', '25');
        }
        if (queryParams.sort !== undefined) {
            params.append('sort', queryParams.sort);
        }
        else {
            params.append('sort', 'fechaCreacion,asc'); 
        }
        return this.request<OrdenResponsePaginada>(`?${params.toString()}`);

    }
    async getOrdenById(ordenId: string): Promise<Orden> {
        return this.request<Orden>(`/${ordenId}`);
    }

    async getPublicacionesByOrdenId(ordenId: string): Promise<Publicacion[]> {
        const map = await this.request<Record<string, Publicacion>>(`/${ordenId}/publicaciones`);
        return Object.values(map);
    }
    
    async createOrden(carroitems: CarroItem[]): Promise<Orden> {
        return this.request<Orden>(`/orden`, {
            method: 'POST',
            body: JSON.stringify(carroitems),
        });
    }

    async reordenar(ordenId: string): Promise<CarroItem[]> {
        return await this.request<CarroItem[]>(`/reordenar/${ordenId}`, {
            method: 'POST',
        });
    }
}

export const apiOrdenes = new ApiOrdenes();