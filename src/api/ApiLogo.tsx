import { API_ENDPOINTS } from "./config";
import { errorHandler } from "./errorHandler";


export type LogoType = 'fondo-claro' | 'fondo-oscuro';


class ApiLogo {
    private baseUrl: string;
    private isLoading = new Map<LogoType, Promise<Blob>>();

    constructor() {
        this.baseUrl = API_ENDPOINTS.logo;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        responseType: 'json' | 'blob' = 'json'
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config: RequestInit = {
            headers: {
                ...(responseType === 'json' && { 'Content-Type': 'application/json' }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                let errorMessage = `Error ${response.status}`;
                
                switch (response.status) {
                    case 404:
                        errorMessage = 'Logo no encontrado';
                        break;
                    case 500:
                        errorMessage = 'Error del servidor al procesar el logo';
                        break;
                    default:
                        errorMessage = `Error ${response.status}: ${response.statusText}`;
                }
                errorHandler.handleConnectionError(response, errorMessage);
                throw new Error(errorMessage);
            }

            if (responseType === 'blob') {
                const blob = await response.blob();
                return blob as unknown as T;
            }

            return response.json();

        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Error de conexión: No se pudo conectar con el servidor');
            }
            throw error;
        }
    }


    private async fetchLogoFromServer(tipo: LogoType): Promise<Blob> {
        const endpoint = tipo === 'fondo-claro' ? '/fondo-claro.png' : '/fondo-oscuro.png';
        
        try {
            
            return await this.request<Blob>(endpoint, {
                method: 'GET',
            }, 'blob');
        } catch (error) {
            console.error(`Error cargando logo ${tipo}:`, error);
            throw error;
        }
    }


    async getLogoFondoClaro(): Promise<Blob> {
        return this.getLogoBlob('fondo-claro');
    }


    async getLogoFondoOscuro(): Promise<Blob> {
        return this.getLogoBlob('fondo-oscuro');
    }


    async getLogoBlob(tipo: LogoType): Promise<Blob> {
        

        const loadingPromise = this.isLoading.get(tipo);
        if (loadingPromise) {
            
            return loadingPromise;
        }

        const promise = this.fetchLogoFromServer(tipo);
        this.isLoading.set(tipo, promise);

        try {
            const blob = await promise;

            this.isLoading.delete(tipo);
            return blob;

        } catch (error) {
            this.isLoading.delete(tipo);
            throw error;
        }
    }

    async getLogoUrl(tipo: LogoType): Promise<string> {
        try {
            const blob = await this.getLogoBlob(tipo);
            const url = URL.createObjectURL(blob);

            return url;
        } catch (error) {
            console.error(`Error obteniendo URL del logo ${tipo}:`, error);
            throw error;
        }
    }

    async preloadLogos(): Promise<void> {
        try {
            
            await Promise.all([
                this.getLogoBlob('fondo-claro'),
                this.getLogoBlob('fondo-oscuro')
            ]);
            
        } catch (error) {
            console.error('Error precargando logos:', error);
        }
    }

}

export const apiLogo = new ApiLogo();