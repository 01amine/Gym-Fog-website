"use client";

import { Product } from "@/lib/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Package } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-yellow-500/50 transition-colors">
      <div className="relative h-32 sm:h-48 bg-zinc-800">
        {product.image_urls && product.image_urls.length > 0 ? (
          <Image
            src={product.image_urls[0]}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="w-10 h-10 sm:w-16 sm:h-16 text-zinc-600" />
          </div>
        )}
        {product.stock_quantity <= 0 && (
          <Badge className="absolute top-2 right-2 bg-red-600 text-[10px] sm:text-xs">Out of Stock</Badge>
        )}
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <Badge className="absolute top-2 right-2 bg-yellow-600 text-[10px] sm:text-xs">Low Stock</Badge>
        )}
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-1 sm:mb-2 gap-2">
          <h3 className="text-sm sm:text-lg font-semibold text-white line-clamp-1">{product.title}</h3>
          <span className="text-yellow-500 font-bold whitespace-nowrap text-xs sm:text-base">
            {formatPrice(product.price_dzd)}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mb-2 sm:mb-3">
          {product.description || "No description"}
        </p>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <Badge variant="outline" className="border-zinc-700 text-gray-400 text-[10px] sm:text-xs px-1.5 py-0.5">
            Stock: {product.stock_quantity}
          </Badge>
          {product.brand && (
            <Badge variant="outline" className="border-zinc-700 text-gray-400 text-[10px] sm:text-xs px-1.5 py-0.5">
              {product.brand}
            </Badge>
          )}
        </div>
        {(product.sizes && product.sizes.length > 0 || product.colors && product.colors.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.sizes?.slice(0, 3).map((size) => (
              <Badge key={size} className="bg-zinc-800 text-gray-300 text-[10px] px-1.5 py-0.5">
                {size}
              </Badge>
            ))}
            {product.sizes && product.sizes.length > 3 && (
              <Badge className="bg-zinc-800 text-gray-300 text-[10px] px-1.5 py-0.5">
                +{product.sizes.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-zinc-700 text-gray-300 hover:text-yellow-500 hover:border-yellow-500 text-xs sm:text-sm h-8 sm:h-9"
          onClick={() => onEdit(product)}
        >
          <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 text-red-400 hover:text-red-300 hover:border-red-500 h-8 sm:h-9"
          onClick={() => onDelete(product)}
        >
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
