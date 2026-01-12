import { API_ENDPOINTS } from "./config";
import { apiToken } from "./ApiToken";
import { errorHandler } from "./errorHandler";


class ApiImages{
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_ENDPOINTS.images;
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

            if (responseType === 'blob') {
                const blob = await response.blob();
                return blob as unknown as T;
            }

            return response.json();
        }

    async getImageBlob(id: number, imagen: string): Promise<Blob> {
        const params = new URLSearchParams();
        params.append('id', id.toString());
        params.append('imagen', imagen);
        
        return this.request<Blob>(`?${params.toString()}`, {
            method: 'GET',
        }, 'blob');
    }
    // Returns a data URL that can be used directly in img src
    async getImageUrl(id: number, imagen: string): Promise<string> {
        const blob = await this.getImageBlob(id, imagen);
        return URL.createObjectURL(blob);
    }


}export const apiImages = new ApiImages();
