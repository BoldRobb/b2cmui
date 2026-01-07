import { API_ENDPOINTS } from "./config";
import type { DocumentosQueryParams, PagosResponsePaginada, DocumentosResponsePaginada, DocumentoResponse } from "../types/DocumentosInterface";
import { apiToken } from "./ApiToken";
import { errorHandler } from "./errorHandler";

class ApiDocument {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_ENDPOINTS.documentos;
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
            const errorMessage = `API Error: ${response.status} ${response.statusText}`;
            errorHandler.handleConnectionError(response, errorMessage);
            console.error('Error en la respuesta:', response.status, response.statusText);
            throw new Error(errorMessage);
        }
        
        return response.json();
    }

    async getFacturas(folio: string, queryParams: DocumentosQueryParams = {}): Promise<DocumentosResponsePaginada> {
        const params = new URLSearchParams();
        
        const token = apiToken.getToken();
        if (!token) {
            throw new Error('No hay token de autenticación disponible');
        }

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


        return this.request<DocumentosResponsePaginada>(`/facturas?${params.toString()}`);
    }

    async getTiposdeOperacion(): Promise<Record<number, string>> {
        return this.request<Record<number, string>>('/tipos-operacion');
    }

    async getPagos(folio: string, queryParams: DocumentosQueryParams = {}): Promise<PagosResponsePaginada> {
     
        const token = apiToken.getToken();
        if (!token) {
            throw new Error('No hay token de autenticación disponible');
        }
        
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
            if(queryParams.sort === 'total,ASC' || queryParams.sort === 'total,DESC') {
            params.append('sort', 'montoAbono' + (queryParams.sort.endsWith('ASC') ? ',ASC' : ',DESC'));
        } else {
            params.append('sort', queryParams.sort);
        }
        }  else {
            params.append('sort', 'fecha,desc');
        }

        if (folio) {
            params.append('folio', folio);
        }
        
        return this.request<PagosResponsePaginada>(`/pagos?${params.toString()}`);
    }

    async getNotasDevolucion(folio: string, queryParams: DocumentosQueryParams = {}): Promise<PagosResponsePaginada> {
        const token = apiToken.getToken();
        if (!token) {
            throw new Error('No hay token de autenticación disponible');
        }
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
            if(queryParams.sort === 'total,ASC' || queryParams.sort === 'total,DESC') {
            params.append('sort', 'montoAbono' + (queryParams.sort.endsWith('ASC') ? ',ASC' : ',DESC'));
        } else {
            params.append('sort', queryParams.sort);
        }
        }  else {
            params.append('sort', 'fecha,desc');
        }
        

        if (folio) {
            params.append('folio', folio);
        }
        return this.request<PagosResponsePaginada>(`/notas-devolucion?${params.toString()}`);
    }
    
    async getOtrosDocumentos(folio: string, queryParams: DocumentosQueryParams = {}): Promise<DocumentosResponsePaginada> {
        const token = apiToken.getToken();
        if (!token) {
            throw new Error('No hay token de autenticación disponible');
        }
        
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
        return this.request<DocumentosResponsePaginada>(`/otros-documentos?${params.toString()}`);
    }

    async getFacturasServicios(folio: string, queryParams: DocumentosQueryParams = {}): Promise<DocumentosResponsePaginada> {
        const token = apiToken.getToken();
        if (!token) {
            throw new Error('No hay token de autenticación disponible');
        }

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
        return this.request<DocumentosResponsePaginada>(`/facturas-servicios?${params.toString()}`);
    }

    async getCargos(folio: string, queryParams: DocumentosQueryParams = {}): Promise<DocumentosResponsePaginada> {
        const token = apiToken.getToken();
        if (!token) {
            throw new Error('No hay token de autenticación disponible');
        }
        
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

        return this.request<DocumentosResponsePaginada>(`/cargos?${params.toString()}`);
    }

    async getMapaMonedas() : Promise<Record<number, string>> {
        return this.request<Record<number, string>>('/mapa-monedas');
    }
    async getMapaVencimientos(documentos: DocumentoResponse[]): Promise<Record<number, Date>> {
        return this.request<Record<number, Date>>('/mapa-vencimientos', {
            method: 'POST',
            body: JSON.stringify({ documentos })
        });
    }
}

export const apiDocumentos = new ApiDocument();