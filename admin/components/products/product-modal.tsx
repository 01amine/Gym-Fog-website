"use client";

import { useState, useEffect } from "react";
import { Product, ProductCreate } from "@/lib/types/product";
import { Category } from "@/lib/types/category";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductCreate, images?: File[]) => void;
  product?: Product | null;
  categories: Category[];
  isLoading?: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  isLoading,
}: ProductModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [brand, setBrand] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [weight, setWeight] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description || "");
      setCategory(product.category);
      setPrice(product.price_dzd.toString());
      setStockQuantity(product.stock_quantity.toString());
      setBrand(product.brand || "");
      setSizes(product.sizes || []);
      setColors(product.colors || []);
      setWeight(product.weight?.toString() || "");
      setImagePreviews(product.image_urls || []);
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setPrice("");
    setStockQuantity("0");
    setBrand("");
    setSizes([]);
    setColors([]);
    setWeight("");
    setNewSize("");
    setNewColor("");
    setImages([]);
    setImagePreviews([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes((prev) => [...prev, newSize.trim()]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setSizes((prev) => prev.filter((s) => s !== size));
  };

  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors((prev) => [...prev, newColor.trim()]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors((prev) => prev.filter((c) => c !== color));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ProductCreate = {
      title,
      description: description || undefined,
      category,
      price_dzd: parseFloat(price),
      stock_quantity: parseInt(stockQuantity),
      brand: brand || undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      colors: colors.length > 0 ? colors : undefined,
      weight: weight ? parseFloat(weight) : undefined,
    };
    onSubmit(data, images.length > 0 ? images : undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-yellow-500 text-lg sm:text-xl">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Category - Stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300 text-sm">
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product title"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300 text-sm">
                Category *
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white focus:border-yellow-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id}
                      className="text-white hover:bg-zinc-700"
                    >
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300 text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-yellow-500 min-h-[80px]"
            />
          </div>

          {/* Price, Stock, Brand - Stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-300 text-sm">
                Price (DZD) *
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-gray-300 text-sm">
                Stock Quantity
              </Label>
              <Input
                id="stock"
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="0"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand" className="text-gray-300 text-sm">
                Brand
              </Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Brand name"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Sizes & Colors - Stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Sizes</Label>
              <div className="flex gap-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="e.g., M, L, XL"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-yellow-500 text-sm"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
                />
                <Button
                  type="button"
                  onClick={addSize}
                  size="icon"
                  className="bg-yellow-500 text-black hover:bg-yellow-400 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {sizes.map((size) => (
                  <Badge
                    key={size}
                    className="bg-zinc-800 text-gray-300 cursor-pointer hover:bg-red-600 text-xs"
                    onClick={() => removeSize(size)}
                  >
                    {size} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Colors</Label>
              <div className="flex gap-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Add color"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-yellow-500 text-sm"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                />
                <Button
                  type="button"
                  onClick={addColor}
                  size="icon"
                  className="bg-yellow-500 text-black hover:bg-yellow-400 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {colors.map((color) => (
                  <Badge
                    key={color}
                    className="bg-zinc-800 text-gray-300 cursor-pointer hover:bg-red-600 text-xs"
                    onClick={() => removeColor(color)}
                  >
                    {color} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-gray-300 text-sm">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0.0"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus:border-yellow-500 w-full sm:w-1/3"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Images</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800">
                  <Image src={preview} alt={`Preview ${index}`} fill className="object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 w-5 h-5 sm:w-6 sm:h-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mb-1" />
                <span className="text-[10px] sm:text-xs text-gray-500">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 text-gray-300 hover:text-white w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title || !category || !price}
              className="bg-yellow-500 text-black hover:bg-yellow-400 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : product ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
