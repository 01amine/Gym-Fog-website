import { createMaterial, deleteMaterialById, editMaterialById, getMaterialById, getMaterials } from "@/lib/api/material";
import { API_ENDPOINTS } from "@/lib/const/endpoint";
import { MaterialsAdmin,EditMaterialVars } from "@/lib/types/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";

// Helper function to safely construct image URLs
const constructImageUrl = (fileId: string): string => {
  if (!fileId) return "/placeholder-lfrkp.png";
  
  // If it's already a complete URL, return it
  if (fileId.startsWith('http://') || fileId.startsWith('https://')) {
    return fileId;
  }
  
  // If it's a relative path, return it as is
  if (fileId.startsWith('/')) {
    return fileId;
  }
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return new URL(`/materials/${fileId}/get_image`, baseUrl).toString();
  } catch (error) {
    console.error("Error constructing image URL:", error);
    return "/placeholder-lfrkp.png";
  }
};

// Helper function to safely construct file URLs
const constructFileUrl = (fileId: string): string => {
  if (!fileId) return "";
  
  // If it's already a complete URL, return it
  if (fileId.startsWith('http://') || fileId.startsWith('https://')) {
    return fileId;
  }
  
  // If it's a relative path, return it as is
  if (fileId.startsWith('/')) {
    return fileId;
  }
  
  // If it's just a filename, construct the full URL safely
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return new URL(`/materials/${fileId}/get_file`, baseUrl).toString();
  } catch (error) {
    console.error("Error constructing file URL:", error);
    return "";
  }
};

export function useGetMaterials(limit: number = 10, skip: number = 0) {
  return useQuery<MaterialsAdmin[], Error>({
    queryKey: ["materials", limit, skip],
    queryFn: () => getMaterials(limit, skip),
    staleTime: 1000 * 60 * 5,
    retry: false,
    select: (data) =>
      data.map((m) => {
        const images =
          m.image_urls.length > 0
            ? m.image_urls.map(constructImageUrl)
            : ["/placeholder-lfrkp.png"]; 

        return {
          ...m,
          id: (m as any)._id ?? m.id,
          image_urls: images,
          pdf_url: constructFileUrl(m.pdf_url),
        };
      }),
  });
}

export  function useGetMaterialById(id:string){
    return useQuery<MaterialsAdmin>({
        queryKey: ["material", id],
        queryFn: () => getMaterialById(id),
        select: (data) => {
            const images =
              data.image_urls.length > 0
                ? data.image_urls.map(constructImageUrl)
                : ["/placeholder-lfrkp.png"]; 
            return {
              ...data,
              id: (data as any)._id ?? data.id,
              image_urls: images,
              pdf_url: constructFileUrl(data.pdf_url),
            };  
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMaterialById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      console.error("Failed to delete material:", error);
    },
  });
}

export function useEditMaterial() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, EditMaterialVars>({
    mutationFn: (vars) => editMaterialById(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (error) => {
      console.error("Failed to update material:", error);
    },
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast({
        title: "Succès! ",
        description: "Le support a été ajouté avec succès.",
      });
    },
    onError: (error) => {
      console.error("Failed to create material:", error);
      toast({
        title: "Erreur! ",
        description: "Échec de l'ajout du support. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });
}