"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminLayout from "@/components/layout/admin-layout"
import { Button } from "@/components/ui/button"
import { Package, FolderOpen, ShoppingCart, Users, TrendingUp, Loader2 } from "lucide-react"
import { useGetProducts } from "@/hooks/queries/useProduct"
import { useGetCategories } from "@/hooks/queries/useCategory"
import Link from "next/link"

export default function DashboardPage() {
  const { data: products, isLoading: isLoadingProducts } = useGetProducts()
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories()

  const isLoading = isLoadingProducts || isLoadingCategories

  const stats = {
    totalProducts: products?.length || 0,
    totalCategories: categories?.length || 0,
    inStock: products?.filter(p => p.stock_quantity > 0).length || 0,
    lowStock: products?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length || 0,
    outOfStock: products?.filter(p => p.stock_quantity <= 0).length || 0,
    totalValue: products?.reduce((acc, p) => acc + (p.price_dzd * p.stock_quantity), 0) || 0,
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400">Welcome to GymFog Admin Panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Products</p>
                  <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-full">
                  <Package className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Categories</p>
                  <p className="text-3xl font-bold text-white">{stats.totalCategories}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <FolderOpen className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">In Stock</p>
                  <p className="text-3xl font-bold text-green-500">{stats.inStock}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Inventory Value</p>
                  <p className="text-2xl font-bold text-yellow-500">{formatPrice(stats.totalValue)}</p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-full">
                  <ShoppingCart className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Stock Overview</CardTitle>
              <CardDescription className="text-gray-400">Product availability status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">In Stock</span>
                <span className="text-green-500 font-semibold">{stats.inStock} products</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stats.totalProducts > 0 ? (stats.inStock / stats.totalProducts) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Low Stock (1-5)</span>
                <span className="text-yellow-500 font-semibold">{stats.lowStock} products</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${stats.totalProducts > 0 ? (stats.lowStock / stats.totalProducts) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Out of Stock</span>
                <span className="text-red-500 font-semibold">{stats.outOfStock} products</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${stats.totalProducts > 0 ? (stats.outOfStock / stats.totalProducts) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">Manage your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/categories">
                <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Manage Categories
                </Button>
              </Link>
              <Link href="/products">
                <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                  <Package className="w-4 h-4 mr-2" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/orders">
                <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </Link>
              <Link href="/users">
                <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Categories Overview */}
        {categories && categories.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Categories</CardTitle>
              <CardDescription className="text-gray-400">Your product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {categories.map((category) => {
                  const productCount = products?.filter(p => p.category === category.id).length || 0
                  return (
                    <div
                      key={category.id}
                      className="p-4 bg-zinc-800 rounded-lg text-center hover:bg-zinc-700 transition-colors"
                    >
                      <p className="text-white font-medium truncate">{category.title}</p>
                      <p className="text-sm text-gray-400">{productCount} products</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
