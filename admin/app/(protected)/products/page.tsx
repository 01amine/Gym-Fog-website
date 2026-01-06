"use client";

import { useState, useMemo } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import ProductCard from "@/components/products/product-card";
import ProductModal from "@/components/products/product-modal";
import DeleteProductModal from "@/components/products/delete-product-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, RefreshCw, Package, Loader2 } from "lucide-react";
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/queries/useProduct";
import { useGetCategories } from "@/hooks/queries/useCategory";
import { Product, ProductCreate } from "@/lib/types/product";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, isLoading: isLoadingProducts, refetch } = useGetProducts();
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        case "price_asc":
          return a.price_dzd - b.price_dzd;
        case "price_desc":
          return b.price_dzd - a.price_dzd;
        case "date_desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "stock_asc":
          return a.stock_quantity - b.stock_quantity;
        case "stock_desc":
          return b.stock_quantity - a.stock_quantity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, categoryFilter, sortBy]);

  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (data: ProductCreate, images?: File[]) => {
    if (selectedProduct) {
      await updateProduct.mutateAsync({
        id: selectedProduct.id,
        data,
        images,
      });
    } else {
      await createProduct.mutateAsync({
        data,
        images,
      });
    }
    handleCloseModal();
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      await deleteProduct.mutateAsync(selectedProduct.id);
      handleCloseDeleteModal();
    }
  };

  const isLoading = isLoadingProducts || isLoadingCategories;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-gray-400">Manage your gym equipment and products</p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
            disabled={!categories || categories.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-yellow-500"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-zinc-900 border-zinc-800 text-white focus:border-yellow-500">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all" className="text-white hover:bg-zinc-700">
                All Categories
              </SelectItem>
              {categories?.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="text-white hover:bg-zinc-700"
                >
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px] bg-zinc-900 border-zinc-800 text-white focus:border-yellow-500">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="date_desc" className="text-white hover:bg-zinc-700">
                Newest First
              </SelectItem>
              <SelectItem value="date_asc" className="text-white hover:bg-zinc-700">
                Oldest First
              </SelectItem>
              <SelectItem value="title_asc" className="text-white hover:bg-zinc-700">
                Title A-Z
              </SelectItem>
              <SelectItem value="title_desc" className="text-white hover:bg-zinc-700">
                Title Z-A
              </SelectItem>
              <SelectItem value="price_asc" className="text-white hover:bg-zinc-700">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price_desc" className="text-white hover:bg-zinc-700">
                Price: High to Low
              </SelectItem>
              <SelectItem value="stock_asc" className="text-white hover:bg-zinc-700">
                Stock: Low to High
              </SelectItem>
              <SelectItem value="stock_desc" className="text-white hover:bg-zinc-700">
                Stock: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="border-zinc-700 text-gray-300 hover:text-yellow-500 hover:border-yellow-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">In Stock</p>
                <p className="text-2xl font-bold text-green-500">
                  {products.filter((p) => p.stock_quantity > 0).length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5).length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">Out of Stock</p>
                <p className="text-2xl font-bold text-red-500">
                  {products.filter((p) => p.stock_quantity <= 0).length}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
          </div>
        ) : !categories || categories.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-zinc-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No categories yet</h3>
              <p className="text-gray-400 text-center mb-4">
                You need to create at least one category before adding products.
              </p>
              <Button
                onClick={() => (window.location.href = "/categories")}
                className="bg-yellow-500 text-black hover:bg-yellow-400"
              >
                Go to Categories
              </Button>
            </CardContent>
          </Card>
        ) : filteredProducts.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-zinc-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
              <p className="text-gray-400 text-center mb-4">
                {searchTerm || categoryFilter !== "all"
                  ? "No products match your search criteria."
                  : "Get started by creating your first product."}
              </p>
              {!searchTerm && categoryFilter === "all" && (
                <Button
                  onClick={() => handleOpenModal()}
                  className="bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleOpenModal}
                onDelete={handleOpenDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        product={selectedProduct}
        categories={categories || []}
        isLoading={createProduct.isPending || updateProduct.isPending}
      />

      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        product={selectedProduct}
        isLoading={deleteProduct.isPending}
      />
    </AdminLayout>
  );
}
