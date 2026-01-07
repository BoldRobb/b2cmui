import type {FacturaModel, FormularioConfigurable, FormularioFacturar, FormularioFacturarModel, MetadatosFacturacionBuscada, RespuestaBusquedaFactura } from "@/types/FacturacionInterface";
import { API_ENDPOINTS } from "./config";
import { errorHandler } from "./errorHandler";

class ApiFacturacion {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_ENDPOINTS.facturacion;
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
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/plain')) {
            return response.text() as Promise<T>;
        }
        return response.json();
    }

    public async configuracionValida(): Promise<boolean> {
        return this.request<boolean>('/configuracion-valida', {
            method: 'GET',
        });
    }

    public async getEstilo(): Promise<string> {
        return this.request<string>('/estilo', {
            method: 'GET',
        });
    }

    public async obtenerCamposFacturacion(): Promise<FormularioConfigurable> {
        return this.request<FormularioConfigurable>('/campos-disponibles', {
            method: 'GET',
        });
    }

    public async getMetadatosFacturacion(formularioBuscar: FormularioConfigurable): Promise<MetadatosFacturacionBuscada> {
        return this.request<MetadatosFacturacionBuscada>(`/generarMetadatos`, {
            method: 'POST',
            body: JSON.stringify(formularioBuscar),
        });
    }

    public async buscarMetadatosFacturacion(metadatos: MetadatosFacturacionBuscada): Promise<RespuestaBusquedaFactura> {
        const resultado = await this.request<RespuestaBusquedaFactura>('/buscar', {
            method: 'POST',
            body: JSON.stringify(metadatos),
        });

        return resultado;
    }

    public async getFacturaByFolio(folio: string): Promise<FacturaModel> {
        return this.request<FacturaModel>(`/factura/${folio}`, {
            method: 'GET',
        });
    }


    public async getFacturarModel(metadatos: MetadatosFacturacionBuscada): Promise<FormularioFacturarModel> {
        return this.request<FormularioFacturarModel>('/formulario-facturar-model', {
            method: 'POST',
            body: JSON.stringify(metadatos),
        });
    }



    public async generarFactura(formularioFacturar: FormularioFacturar): Promise<RespuestaBusquedaFactura> {
        return this.request<RespuestaBusquedaFactura>('/generar', {
            method: 'POST',
            body: JSON.stringify(formularioFacturar),
        });
    }
    public async getInfoFacturacionCliente(metadatos: MetadatosFacturacionBuscada): Promise<FormularioFacturar> {
        return this.request<FormularioFacturar>('/info-facturacion', {
            method: 'POST',
            body: JSON.stringify(metadatos),
        });
    }
    
}

export const apiFacturacion = new ApiFacturacion();