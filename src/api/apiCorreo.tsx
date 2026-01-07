import type { DatosCorreo } from "@/types";
import { API_ENDPOINTS } from "./config";
import { apiToken } from "./ApiToken";
import { errorHandler } from "./errorHandler";

class ApiCorreo{
    private baseUrl: string;

    constructor(){
        this.baseUrl = API_ENDPOINTS.correo;
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
                await this.handleErrorResponse(response);
            }
            
            return response.json();
        }

    async sendEmail(datosCorreo: DatosCorreo, archivosId: number[], tipoDocumento: string): Promise<{success: boolean; message: string}> {
        const payload = {
        datosCorreo: datosCorreo,
        archivos: archivosId,
        tipoDocumento: tipoDocumento
    };

        return this.request<{ success: boolean; message: string }>(`/enviar`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }



private async handleErrorResponse(response: Response): Promise<never> {
    const contentType = response.headers.get('Content-Type');
    
    try {

        if (contentType?.includes('text/plain')) {
            const errorMessage = await response.text();
            
            errorHandler.handleConnectionError(response, errorMessage);

            throw new Error(errorMessage);
        }

        else if (contentType?.includes('application/json')) {
            const errorData = await response.json();
            const errorMessage = errorData.message || errorData.error || 'Error desconocido';
            
            errorHandler.handleConnectionError(response, errorMessage);

            throw new Error(errorMessage);
        }

        else {
            switch (response.status) {
                case 404:
                    throw new Error('Uno de los documentos solicitados no fue encontrado');
                case 500:
                    throw new Error('Error interno del servidor al procesar el envio de correo');
                default:
                    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
            }
        }
    } catch (parseError) {

        if (parseError instanceof Error && parseError.message && !parseError.message.includes('parseando')) {
            throw parseError; 
        }
        
        console.error('Error parseando respuesta de error:', parseError);
        switch (response.status) {
                case 404:
                    throw new Error('Uno de los documentos solicitados no fue encontrado');
                case 500:
                    throw new Error('Error interno del servidor al procesar el envio de correo');
                default:
                    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
            }
    }
}
}export const apiCorreo = new ApiCorreo();