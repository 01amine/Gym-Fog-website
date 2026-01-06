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
  Heart
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/context/cart-context"
import { getProductById } from "@/lib/api/products"
import { Product } from "@/lib/types"
import Link from "next/link"
import { toast } from "sonner"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const { addItem, getItemQuantity, updateQuantity: updateCartQuantity } = useCart()
  const cartQuantity = product ? getItemQuantity(product.id) : 0

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(productId)
        setProduct(data)
        // Set default selections
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0])
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
      fetchProduct()
    }
  }, [productId, router])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product)
      }
      toast.success(`${quantity} x ${product.title} added to cart`)
      setQuantity(1)
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
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
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
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider hidden sm:inline">BACK TO SHOP</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 overflow-hidden border border-white/20">
              <img src="/gymfog-logo.jpeg" alt="GYM FOG" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-display italic">GYM FOG</span>
          </Link>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="pt-16">
        <div className="container mx-auto px-4 py-6 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Gallery - Mobile First */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-zinc-900 overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={getProductImageUrl(product.image_urls[selectedImageIndex])}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product.image_urls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-accent hover:text-black text-white flex items-center justify-center transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-accent hover:text-black text-white flex items-center justify-center transition-all"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter - Mobile */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 text-xs font-bold lg:hidden">
                  {selectedImageIndex + 1} / {product.image_urls.length}
                </div>

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-red-500 font-bold text-xl sm:text-2xl">OUT OF STOCK</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery - Desktop */}
              {product.image_urls.length > 1 && (
                <div className="hidden lg:flex gap-2 overflow-x-auto pb-2">
                  {product.image_urls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-accent'
                          : 'border-white/10 hover:border-white/30'
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

              {/* Thumbnail Gallery - Mobile (Horizontal Scroll) */}
              {product.image_urls.length > 1 && (
                <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                  {product.image_urls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-accent'
                          : 'border-white/10'
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
            <div className="space-y-6">
              {/* Category Badge */}
              <Badge className="bg-accent text-black rounded-none font-bold tracking-wider">
                {product.category}
              </Badge>

              {/* Title & Price */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display italic text-white mb-2">
                  {product.title}
                </h1>
                <p className="text-2xl sm:text-3xl text-accent font-display italic">
                  {product.price_dzd.toLocaleString()} DA
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Brand */}
              {product.brand && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Brand:</span>
                  <span className="text-white font-semibold">{product.brand}</span>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 tracking-wider">
                    SIZE
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] h-12 px-4 border-2 font-bold text-sm transition-all ${
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
                  <label className="text-sm font-bold text-gray-400 tracking-wider">
                    COLOR: <span className="text-white">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`h-12 px-4 border-2 font-bold text-sm transition-all ${
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
                <label className="text-sm font-bold text-gray-400 tracking-wider">
                  QUANTITY
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-white/20">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors"
                      disabled={isOutOfStock}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors"
                      disabled={isOutOfStock || quantity >= product.stock_quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock_quantity} available
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 h-14 sm:h-16 bg-accent text-black hover:bg-white font-display italic text-lg sm:text-xl"
                >
                  {isOutOfStock ? (
                    'OUT OF STOCK'
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      ADD TO CART
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="h-14 sm:h-16 px-6 border-2 border-white/20 text-white hover:border-accent hover:text-accent bg-transparent"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Cart Status */}
              {cartQuantity > 0 && (
                <div className="flex items-center gap-2 text-accent text-sm">
                  <Check className="w-4 h-4" />
                  <span>{cartQuantity} already in your cart</span>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-gray-400">Nationwide Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-gray-400">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Package className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-gray-400">Secure Packaging</span>
                </div>
              </div>

              {/* Additional Info */}
              {product.weight && (
                <div className="text-sm text-gray-500 pt-4 border-t border-white/10">
                  Weight: {product.weight} kg
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-4 lg:hidden z-50">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-white font-display italic text-lg">{product.price_dzd.toLocaleString()} DA</p>
            <p className="text-xs text-gray-500">{product.stock_quantity} in stock</p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="h-12 px-8 bg-accent text-black hover:bg-white font-bold"
          >
            {isOutOfStock ? 'SOLD OUT' : 'ADD TO CART'}
          </Button>
        </div>
      </div>

      {/* Bottom Padding for Mobile Sticky Bar */}
      <div className="h-24 lg:hidden"></div>
    </div>
  )
}
