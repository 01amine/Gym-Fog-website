"use client";

import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import CategoryCard from "@/components/categories/category-card";
import CategoryModal from "@/components/categories/category-modal";
import DeleteCategoryModal from "@/components/categories/delete-category-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, RefreshCw, FolderOpen, Loader2 } from "lucide-react";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/queries/useCategory";
import { Category } from "@/lib/types/category";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: categories, isLoading, refetch } = useGetCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const filteredCategories = categories?.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleOpenModal = (category?: Category) => {
    setSelectedCategory(category || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleOpenDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (data: { title: string; description: string }, image?: File) => {
    if (selectedCategory) {
      await updateCategory.mutateAsync({
        id: selectedCategory.id,
        data,
        image,
      });
    } else {
      await createCategory.mutateAsync({
        data,
        image,
      });
    }
    handleCloseModal();
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      await deleteCategory.mutateAsync(selectedCategory.id);
      handleCloseDeleteModal();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Categories</h1>
            <p className="text-gray-400">Manage your product categories</p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-yellow-500"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="border-zinc-700 text-gray-300 hover:text-yellow-500 hover:border-yellow-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="w-16 h-16 text-zinc-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No categories found</h3>
              <p className="text-gray-400 text-center mb-4">
                {searchTerm
                  ? "No categories match your search criteria."
                  : "Get started by creating your first category."}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => handleOpenModal()}
                  className="bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleOpenModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        category={selectedCategory}
        isLoading={createCategory.isPending || updateCategory.isPending}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        category={selectedCategory}
        isLoading={deleteCategory.isPending}
      />
    </AdminLayout>
  );
}
