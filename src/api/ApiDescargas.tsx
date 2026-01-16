import { API_ENDPOINTS } from "./config";
import { apiToken } from "./ApiToken";
import { notificationService } from '../services/notificationService';
import { errorHandler } from "./errorHandler";

class ApiDescargas{
    private baseUrl: string;
    constructor() {
        this.baseUrl = API_ENDPOINTS.descargas;
    }

    private async downloadRequest(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Blob> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const token = apiToken.getToken();
        
        const config: RequestInit = {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);
        if (!response.ok) {
                
                
                let errorMessage = await response.text();
                if(errorMessage == ''){
                    errorMessage = 'No se pudo descargar el documento.';
                }
                if(errorMessage && errorMessage.includes('NonUniqueResultException')) {
                    errorMessage = 'No se pudo descargar el documento.';
                }

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
                throw new Error(errorMessage);
            }
        
        return response.blob();
    }



    async descargarDocumento(
        tipoDocumento: string, 
        documentoId: number, 
        tipoDescarga: string
    ): Promise<Blob> {
        return await this.downloadRequest(`/${tipoDocumento}/${documentoId}/${tipoDescarga}`);
        
    }


    async descargarComprimidos(
        tipoDocumento: string, 
        documentosIds: number[]
    ): Promise<Blob> {
        const formData = new FormData();
        documentosIds.forEach(id => {
            formData.append('archivos-seleccionados', id.toString());
        });

        return this.downloadRequest(`/${tipoDocumento}/comprimidos`, {
            method: 'POST',
            body: formData
        });
    }

    async descargarDocumentoPublico(
        tipoDocumento: string, 
        documentoId: number,
        tipoDescarga: string
    ): Promise<Blob> {
        const url = `${this.baseUrl}/publico/${tipoDocumento}/${documentoId}/${tipoDescarga}`;
        const response = await fetch(url);
        
        if (!response.ok) {
                
                
                let errorMessage = await response.text();
                if(errorMessage == ''){
                    errorMessage = 'No se pudo descargar el documento.';
                }
                if(errorMessage && errorMessage.includes('NonUniqueResultException')) {
                    errorMessage = 'No se pudo descargar el documento.';
                }

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
                
                throw new Error(errorMessage);
            }

        
        return response.blob();
    }

    static downloadBlob(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }


    async descargarYGuardarDocumento(
        tipoDocumento: string, 
        documentoId: number,
        documentoFolio: string,
        tipoDescarga: string,
        filename?: string
    ): Promise<void> {
        const loadingKey = notificationService.loading('Iniciando descarga...');
        try {
            const blob = await this.descargarDocumento(tipoDocumento, documentoId, tipoDescarga);
            const defaultFilename = filename || `${documentoFolio}.${tipoDescarga.toLowerCase()}`;
            
            ApiDescargas.downloadBlob(blob, defaultFilename);
            notificationService.close(loadingKey);
            notificationService.success('Documento descargado correctamente');
        } catch (error) {
            console.error('Error descargando documento:', error);
            notificationService.close(loadingKey);
            notificationService.error('' + error);
            
            throw error;
        }
    }

   

    async descargarYGuardarComprimidos(
        tipoDocumento: string, 
        documentosIds: number[],
        filename?: string
    ): Promise<void> {
        const loadingKey = notificationService.loading(`Descargando ${documentosIds.length} documentos...`);
        try {
            const blob = await this.descargarComprimidos(tipoDocumento, documentosIds);
            const defaultFilename = filename || `${tipoDocumento.toLowerCase()}-comprimidos.zip`;
            ApiDescargas.downloadBlob(blob, defaultFilename);
            notificationService.close(loadingKey);
            notificationService.success(`${documentosIds.length} documentos descargados correctamente`);
        } catch (error) {
            notificationService.close(loadingKey);
            notificationService.error('' + error);
            console.error('Error descargando comprimidos:', error);
            throw error;
        }
    }

    
    async descargarYGuardarDocumentoPublico(
        tipoDocumento: string, 
        documentoId: number, 
        documentoFolio: string,
        tipoDescarga: string,
        filename?: string
    ): Promise<void> {
        const loadingKey = notificationService.loading('Iniciando descarga...');
        try {
            const blob = await this.descargarDocumentoPublico(tipoDocumento, documentoId, tipoDescarga);
            const defaultFilename = filename || `${documentoFolio}.${tipoDescarga.toLowerCase()}`;
            ApiDescargas.downloadBlob(blob, defaultFilename);
            notificationService.close(loadingKey);
            notificationService.success('Documento descargado correctamente');
        } catch (error) {
            console.error('Error descargando documento público:', error);
            notificationService.error('' + error);
            throw error;
        }
    }


}export const apiDescargas = new ApiDescargas();    