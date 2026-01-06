"use client";

import { Category } from "@/lib/types/category";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FolderOpen } from "lucide-react";
import Image from "next/image";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-yellow-500/50 transition-colors">
      <div className="relative h-40 bg-zinc-800">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <FolderOpen className="w-16 h-16 text-zinc-600" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{category.title}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">{category.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-zinc-700 text-gray-300 hover:text-yellow-500 hover:border-yellow-500"
          onClick={() => onEdit(category)}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 text-red-400 hover:text-red-300 hover:border-red-500"
          onClick={() => onDelete(category)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
