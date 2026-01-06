"use client";

import { Category } from "@/lib/types/category";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FolderOpen } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-yellow-500/50 transition-colors">
      <div className="h-24 sm:h-32 bg-zinc-800 flex items-center justify-center">
        <FolderOpen className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500/50" />
      </div>
      <CardContent className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 truncate">{category.title}</h3>
        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{category.description}</p>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-zinc-700 text-gray-300 hover:text-yellow-500 hover:border-yellow-500 text-xs sm:text-sm"
          onClick={() => onEdit(category)}
        >
          <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 text-red-400 hover:text-red-300 hover:border-red-500"
          onClick={() => onDelete(category)}
        >
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
