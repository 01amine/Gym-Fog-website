"use client";
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from 'lucide-react'
import Image from "next/image"
import { MaterialsAdmin } from "@/lib/types/material"
import { useDeleteMaterial } from "@/hooks/queries/useMaterial"
import { useRouter } from "next/navigation"

// Helper function to validate and construct image URL
const getValidImageUrl = (url: string | undefined): string => {
  if (!url) return "/placeholder.svg";
  
  // If it's already a complete URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path, return it as is
  if (url.startsWith('/')) {
    return url;
  }
  
  // If it's just a filename, construct the full URL safely
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return new URL(`/materials/${url}/get_image`, baseUrl).toString();
  } catch (error) {
    console.error('Error constructing image URL:', error);
    return "/placeholder.svg";
  }
};


interface MaterialsGridProps {
  materials: MaterialsAdmin[]
}

export default function MaterialsGrid({ materials }: MaterialsGridProps) {
const router = useRouter()

  const deleteMutation = useDeleteMaterial()

  const handleEdit = (id: string)=>{
      router.push(`/materials/${id}`)

  }

const handleview = (id: string) => {
  router.push(`/materials/${id}`)
}

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {materials.map((material) => (
        <Card key={material.id} className="overflow-hidden">
          <div className="aspect-[3/4] relative">
            {material.image_urls.length > 1 ? (
              <div className="grid grid-cols-2 gap-1 h-full">
                {material.image_urls.slice(0, 4).map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={getValidImageUrl(url)}
                      alt={`${material.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {index === 3 && material.image_urls.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          +{material.image_urls.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Image
                src={getValidImageUrl(material.image_urls[0])}
                alt={material.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{material.title}</h3>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{material.description}</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {material.material_type}
              </Badge>
              <span className="font-bold text-green-600">{material.price_dzd} DZD</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <Button variant="ghost" size="sm" onClick={() => handleview(material.id)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(material.id)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDelete(material.id)} 
                disabled={deleteMutation.isPending}
                className={deleteMutation.isPending ? "opacity-50" : ""}
              >
                {deleteMutation.isPending ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
