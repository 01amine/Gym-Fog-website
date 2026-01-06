"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, ShoppingCart, Trash2, HeartOff } from "lucide-react"
import Link from "next/link"
import { useFavorites } from "@/lib/context/favorites-context"
import { useCart } from "@/lib/context/cart-context"
import { toast } from "sonner"

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()
  const { addItem } = useCart()

  const getProductImageUrl = (imageUrls: string[]) => {
    if (imageUrls && imageUrls.length > 0) {
      return imageUrls[0]
    }
    return "/placeholder.jpg"
  }

  const handleAddToCart = (product: typeof favorites[0]) => {
    addItem(product)
    toast.success(`${product.title} added to cart`)
  }

  const handleRemove = (product: typeof favorites[0]) => {
    removeFavorite(product.id)
    toast.success(`${product.title} removed from favorites`)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-accent transition-colors">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-bold hidden sm:inline">BACK TO SHOP</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Heart className="w-5 h-5 text-accent fill-accent" />
            <h1 className="text-base sm:text-lg font-display italic">MY FAVORITES</h1>
          </div>
          <div className="w-20 sm:w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-muted rounded-full mb-6">
              <HeartOff className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display italic mb-4">NO FAVORITES YET</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Start adding products to your favorites by clicking the heart icon on any product you like.
            </p>
            <Link href="/">
              <Button className="bg-accent text-black hover:bg-white font-display italic">
                BROWSE PRODUCTS
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Header with count and clear button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display italic">YOUR FAVORITES</h2>
                <p className="text-muted-foreground text-sm">
                  {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  clearFavorites()
                  toast.success("All favorites cleared")
                }}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {favorites.map((product) => (
                <Card key={product.id} className="group bg-muted border-none overflow-hidden hover:ring-2 hover:ring-accent transition-all duration-300">
                  <Link href={`/product/${product.id}`}>
                    <CardContent className="p-0 aspect-square relative overflow-hidden">
                      <img
                        src={getProductImageUrl(product.image_urls)}
                        alt={product.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                      />
                      {product.stock_quantity <= 0 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="text-red-500 font-bold text-xs sm:text-lg">OUT OF STOCK</span>
                        </div>
                      )}
                      {/* Remove from favorites button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemove(product)
                        }}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 bg-black/70 hover:bg-red-500 text-white rounded-full transition-colors"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </CardContent>
                  </Link>
                  <CardFooter className="flex flex-col items-stretch p-3 sm:p-4 bg-muted/50 backdrop-blur-sm gap-2 sm:gap-3">
                    <div>
                      <h4 className="font-display italic text-sm sm:text-lg truncate">{product.title}</h4>
                      <p className="text-accent font-bold text-xs sm:text-base">{product.price_dzd.toLocaleString()} DA</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-accent text-black hover:bg-white text-xs sm:text-sm h-9 sm:h-10"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity <= 0}
                      >
                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        ADD TO CART
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
