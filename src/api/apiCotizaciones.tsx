import type { DocumentosQueryParams, DocumentosResponsePaginada } from "../types/DocumentosInterface";
import type { DocumentoDetallado } from "../types/PedidosInterface";
import { API_ENDPOINTS } from "./config";
import { apiToken } from "./ApiToken";
import { errorHandler } from "./errorHandler";

class ApiCotizaciones{
    private baseUrl: string;

    constructor(){
        this.baseUrl = API_ENDPOINTS.cotizaciones;
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

    async getCotizaciones(folio: string, queryParams: DocumentosQueryParams = {}): Promise<DocumentosResponsePaginada> {
        const params = new URLSearchParams();

        if (queryParams.page !== undefined) {
            params.append('page', queryParams.page.toString());
        } else {
            params.append('page', '0'); 
        }

        if (queryParams.size !== undefined) {
            params.append('size', queryParams.size.toString());
        } else {
            params.append('size', '25'); 
        }

        if (queryParams.sort !== undefined) {
            params.append('sort', queryParams.sort);
        } else {
            params.append('sort', 'fecha,desc');
        }

        if (folio) {
            params.append('folio', folio);
        }

        return this.request<DocumentosResponsePaginada>(`?${params.toString()}`);
    }

    async getCotizacionById(id: string): Promise<DocumentoDetallado> {


        return this.request<DocumentoDetallado>(`/${id}`);
    }
}export const apiCotizaciones = new ApiCotizaciones();