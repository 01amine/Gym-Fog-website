"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Check,
  Truck,
  Shield,
  Package,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Heart,
  Zap,
  Share2,
  Star
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/context/cart-context"
import { useFavorites } from "@/lib/context/favorites-context"
import { getProductById } from "@/lib/api/products"
import { getCategories } from "@/lib/api/categories"
import { Product, Category } from "@/lib/types"
import Link from "next/link"
import { toast } from "sonner"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [imageZoomed, setImageZoomed] = useState(false)

  const { addItem, getItemQuantity } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const cartQuantity = product ? getItemQuantity(product.id) : 0
  const isProductFavorite = product ? isFavorite(product.id) : false

  useEffect(() => {
    async function fetchData() {
      try {
        const [productData, categoriesData] = await Promise.all([
          getProductById(productId),
          getCategories()
        ])
        setProduct(productData)
        setCategories(categoriesData)
        // Set default selections
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0])
        }
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0])
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast.error("Product not found")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }
    if (productId) {
      fetchData()
    }
  }, [productId, router])

  const getCategoryTitle = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId)
    return cat?.title || categoryId
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product)
      }
      toast.success(`${quantity} x ${product.title} added to cart`)
      setQuantity(1)
    }
  }

  const handleBuyNow = () => {
    if (product) {
      // Add to cart first
      for (let i = 0; i < quantity; i++) {
        addItem(product)
      }
      // Then redirect to checkout
      router.push("/checkout")
    }
  }

  const handleToggleFavorite = () => {
    if (product) {
      toggleFavorite(product)
      toast.success(isProductFavorite ? "Removed from favorites" : "Added to favorites")
    }
  }

  const handleShare = async () => {
    if (product) {
      try {
        if (navigator.share) {
          await navigator.share({
            title: product.title,
            text: `Check out ${product.title} at GYM FOG!`,
            url: window.location.href,
          })
        } else {
          await navigator.clipboard.writeText(window.location.href)
          toast.success("Link copied to clipboard!")
        }
      } catch (error) {
        // User cancelled share
      }
    }
  }

  const nextImage = () => {
    if (product && product.image_urls.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === product.image_urls.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (product && product.image_urls.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.image_urls.length - 1 : prev - 1
      )
    }
  }

  const getProductImageUrl = (url: string) => {
    if (!url) return '/placeholder.jpg'
    return url
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <Link href="/">
            <Button className="bg-accent text-black hover:bg-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock_quantity <= 0

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-bold tracking-wider hidden sm:inline">BACK</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 overflow-hidden border border-white/20">
              <img src="/gymfog-logo.jpeg" alt="GYM FOG" className="w-full h-full object-cover" />
            </div>
            <span className="text-base sm:text-lg font-display italic">GYM FOG</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:text-accent"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 ${isProductFavorite ? 'text-red-500' : 'hover:text-red-500'}`}
              onClick={handleToggleFavorite}
            >
              <Heart className={`w-5 h-5 ${isProductFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-14 sm:pt-16">
        <div className="container mx-auto px-4 py-4 sm:py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Image */}
              <div
                className="relative aspect-square bg-zinc-900 overflow-hidden group cursor-zoom-in"
                onClick={() => setImageZoomed(!imageZoomed)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={getProductImageUrl(product.image_urls[selectedImageIndex])}
                    alt={product.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${imageZoomed ? 'scale-150' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product.image_urls.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-accent hover:text-black text-white flex items-center justify-center transition-all rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/60 hover:bg-accent hover:text-black text-white flex items-center justify-center transition-all rounded-full"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}

                {/* Image Dots */}
                {product.image_urls.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.image_urls.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(index); }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedImageIndex === index ? 'bg-accent w-6' : 'bg-white/50 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-red-500 font-bold text-2xl sm:text-3xl block mb-2">OUT OF STOCK</span>
                      <span className="text-gray-400 text-sm">Check back later</span>
                    </div>
                  </div>
                )}

                {/* Favorite Badge */}
                {isProductFavorite && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" /> SAVED
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.image_urls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                  {product.image_urls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden transition-all rounded-lg ${
                        selectedImageIndex === index
                          ? 'ring-2 ring-accent ring-offset-2 ring-offset-black'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getProductImageUrl(url)}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-5 sm:space-y-6">
              {/* Category & Brand */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-accent text-black rounded-full font-bold tracking-wider text-xs">
                  {getCategoryTitle(product.category)}
                </Badge>
                {product.brand && (
                  <Badge variant="outline" className="border-white/20 text-gray-400 rounded-full text-xs">
                    {product.brand}
                  </Badge>
                )}
                {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                  <Badge className="bg-orange-500 text-white rounded-full text-xs">
                    Only {product.stock_quantity} left!
                  </Badge>
                )}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display italic text-white mb-2 leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3">
                  <p className="text-2xl sm:text-3xl text-accent font-bold">
                    {product.price_dzd.toLocaleString()} DA
                  </p>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed border-l-2 border-accent pl-4">
                  {product.description}
                </p>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-white tracking-wider">
                      SIZE
                    </label>
                    <button className="text-xs text-accent hover:underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[50px] h-11 px-4 border-2 font-bold text-sm transition-all rounded-lg ${
                          selectedSize === size
                            ? 'border-accent bg-accent text-black'
                            : 'border-white/20 text-white hover:border-white/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white tracking-wider">
                    COLOR: <span className="font-normal text-accent">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`h-11 px-5 border-2 font-bold text-sm transition-all rounded-lg ${
                          selectedColor === color
                            ? 'border-accent bg-accent text-black'
                            : 'border-white/20 text-white hover:border-white/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-white tracking-wider">
                  QUANTITY
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-zinc-900 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors"
                      disabled={isOutOfStock}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-14 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors"
                      disabled={isOutOfStock || quantity >= product.stock_quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Buy Now Button */}
                <Button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full h-14 bg-accent text-black hover:bg-white font-display italic text-lg rounded-lg"
                >
                  {isOutOfStock ? (
                    'OUT OF STOCK'
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      BUY NOW - {(product.price_dzd * quantity).toLocaleString()} DA
                    </>
                  )}
                </Button>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  variant="outline"
                  className="w-full h-12 border-2 border-white/20 text-white hover:border-accent hover:text-accent bg-transparent font-bold rounded-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  ADD TO CART
                </Button>

                {/* Favorite Button - Mobile */}
                <Button
                  onClick={handleToggleFavorite}
                  variant="outline"
                  className={`w-full h-12 border-2 rounded-lg ${
                    isProductFavorite
                      ? 'border-red-500 text-red-500 hover:bg-red-500/10'
                      : 'border-white/20 text-white hover:border-red-500 hover:text-red-500'
                  } bg-transparent font-bold lg:hidden`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isProductFavorite ? 'fill-current' : ''}`} />
                  {isProductFavorite ? 'SAVED TO FAVORITES' : 'ADD TO FAVORITES'}
                </Button>
              </div>

              {/* Cart Status */}
              {cartQuantity > 0 && (
                <div className="flex items-center gap-2 text-green-500 text-sm bg-green-500/10 px-4 py-2 rounded-lg">
                  <Check className="w-4 h-4" />
                  <span>{cartQuantity} already in your cart</span>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
                  <Truck className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-[10px] sm:text-xs text-gray-400 block">Fast Delivery</span>
                </div>
                <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
                  <Shield className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-[10px] sm:text-xs text-gray-400 block">Quality Guarantee</span>
                </div>
                <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
                  <Package className="w-6 h-6 text-accent mx-auto mb-2" />
                  <span className="text-[10px] sm:text-xs text-gray-400 block">Secure Package</span>
                </div>
              </div>

              {/* Additional Info */}
              {product.weight && (
                <div className="text-sm text-gray-500 pt-2">
                  Product weight: {product.weight} kg
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/98 backdrop-blur-md border-t border-white/10 p-3 sm:p-4 lg:hidden z-50 safe-area-inset-bottom">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-lg truncate">{product.title}</p>
            <p className="text-accent font-bold">{(product.price_dzd * quantity).toLocaleString()} DA</p>
          </div>
          <Button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="h-12 px-6 bg-accent text-black hover:bg-white font-bold rounded-lg"
          >
            {isOutOfStock ? 'SOLD OUT' : 'BUY NOW'}
          </Button>
        </div>
      </div>

      {/* Bottom Padding for Mobile Sticky Bar */}
      <div className="h-24 lg:hidden"></div>
    </div>
  )
}
