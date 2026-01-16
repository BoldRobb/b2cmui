import { apiImages } from "../api/apiImages";
import { useQuery, useQueries } from "@tanstack/react-query";
import type { Publicacion } from "../types/PedidosInterface";

const useImageUrl = (publicacionId?: number, imageName?: string | null) => {
    return useQuery({
        queryKey: ['product-image', publicacionId, imageName],
        queryFn: async () => {
            if (!imageName) {
                return null;
            }
            if(!publicacionId){
                return null;
            }
            const response = await apiImages.getImageUrl(publicacionId, imageName);
            return response;
        },
        enabled: !!imageName && !!publicacionId,
        staleTime: 1000 * 60 * 15,
    });
}

export function useImage(publicacionId?: number, imageName?: string | null) {
    const query = useImageUrl(publicacionId, imageName);

    return {
        imageUrl: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
    };
}

export function useProductImages(publicacion?: Publicacion | null) {
    const queries = useQueries({
        queries: (publicacion?.imagenes || []).map((imageName) => ({
            queryKey: ['product-image', publicacion?.id, imageName],
            queryFn: async () => {
                if (!imageName || !publicacion?.id) {
                    return null;
                }
                const response = await apiImages.getImageUrl(publicacion.id, imageName);
                return response;
            },
            enabled: !!imageName && !!publicacion?.id,
            staleTime: 1000 * 60 * 15,
        }))
    });

    return {
        imageUrls: queries.map(q => q.data || null),
        isLoading: queries.some(q => q.isLoading),
        isError: queries.some(q => q.isError),
    };
}