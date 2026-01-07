import { API_ENDPOINTS } from "./config";
import { apiToken } from "./ApiToken";
import type {  ArticuloExistencia, Publicacion, PublicacionResponsePaginada } from "../types/PedidosInterface";
import type { DocumentosQueryParams } from "../types/DocumentosInterface";
import type { Categoria } from "../types/CategoriasInterface";
import { errorHandler } from "./errorHandler";

class ApiCatalogo{
    private baseUrl: string;

    constructor(){
        this.baseUrl = API_ENDPOINTS.catalogo;
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

        async getPublicaciones(nombre: string, precioMin: number | null, precioMax: number | null, categoria: string, disponible: boolean | null, queryParams: DocumentosQueryParams = {}): Promise<PublicacionResponsePaginada> {
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
            params.append('sort', 'precio,desc');
        }

        if (nombre) {
            params.append('nombre', nombre);
        }
        if (precioMin) {
            params.append('precioMin', precioMin.toString());
        }
        if (precioMax) {
            params.append('precioMax', precioMax.toString());
        }
        if (disponible) {
            params.append('disponible', disponible.toString());
        }
        if( categoria) {
            params.append('categoria', categoria);
        }

        const nofiltroDisponible = this.request<PublicacionResponsePaginada>(`/publicaciones?${params.toString()}`);
        if(disponible){
            const resp = await nofiltroDisponible;
            if (resp && Array.isArray(resp.content)) {
                resp.content = resp.content.filter((pub: Publicacion) => {
                    return typeof pub.cantidad === 'number' && pub.cantidad !== 0;
                });
            }
            
            return resp;
        }
        return await nofiltroDisponible;
        }

        async getCategorias(): Promise<Categoria[]> {
        return this.request<Categoria[]>(`/categorias`);
        }

        async getCategoriasPath(): Promise<Record<string, string>> {
            return this.request<Record<string, string>>(`/categorias-paths`);
        }

        async getPublicacionById(id: number): Promise<Publicacion> {
            return this.request<Publicacion>(`/publicaciones/${id}`);
        }

        async getPublicacionesExistenciasById(id: number): Promise<ArticuloExistencia[]> {
            return this.request<ArticuloExistencia[]>(`/publicaciones/${id}/existencias`);
        }


}export const apiCatalogo = new ApiCatalogo();