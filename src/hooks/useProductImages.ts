import { apiImages } from "../api/apiImages";
import { useQuery } from "@tanstack/react-query";

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