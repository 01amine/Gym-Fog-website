"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Play, Instagram, Facebook, MessageCircle, X, Menu, Plus, Minus, Loader2, Heart, User, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/lib/context/cart-context"
import { useFavorites } from "@/lib/context/favorites-context"
import { useLanguage } from "@/lib/context/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { getProducts } from "@/lib/api/products"
import { getCategories } from "@/lib/api/categories"
import { Product, Category } from "@/lib/types"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [whatsappMessage, setWhatsappMessage] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const router = useRouter()
  const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity } = useCart()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const { t, isRTL } = useLanguage()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("gymfog_user")
    setIsLoggedIn(!!user)
  }, [])

  // Fetch products and categories from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
        setIsLoaded(true)
      }
    }
    fetchData()
  }, [])

  const categoryOptions = useMemo(() => {
    return [{ id: "ALL", title: "ALL" }, ...categories.map(c => ({ id: c.id, title: c.title.toUpperCase() }))]
  }, [categories])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "ALL") return products
    // Find the category by its ID and filter products
    return products.filter((p) => p.category === selectedCategory)
  }, [selectedCategory, products])

  const getCategoryTitle = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId)
    return cat?.title || categoryId
  }

  const openWhatsApp = (message?: string) => {
    const text = message || "Hello GYM FOG! I'd like to inquire about your gear."
    window.open(`https://wa.me/213000000000?text=${encodeURIComponent(text)}`, "_blank")
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(`${product.title} ${t.addToCart.toLowerCase()}`)
  }

  const handleBuyNow = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    router.push("/checkout")
  }

  const handleToggleFavorite = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product.id)
    if (isFavorite(product.id)) {
      toast.success(t.removedFromFavorites)
    } else {
      toast.success(t.savedToFavorites)
    }
  }

  const getProductImageUrl = (product: Product) => {
    if (product.image_urls && product.image_urls.length > 0) {
      return product.image_urls[0]
    }
    return `/placeholder.jpg`
  }

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-32 h-32 sm:w-48 sm:h-48 relative overflow-hidden"
            >
              <img src="/gymfog-logo.jpeg" alt="GYM FOG Logo" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Mobile First */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
        className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10"
      >
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          {/* Desktop Nav - Left */}
          <div className={`hidden md:flex items-center gap-6 text-[10px] font-bold tracking-widest flex-1 ${isRTL ? "flex-row-reverse" : ""}`}>
            <a href="#shop" className="hover:text-accent transition-colors">{t.shop}</a>
            <a href="#story" className="hover:text-accent transition-colors">{t.ourStory}</a>
            <a href="#contact" className="hover:text-accent transition-colors">{t.contact}</a>
          </div>

          {/* Logo - Center */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 relative overflow-hidden border border-white/20 group-hover:scale-110 transition-transform duration-300">
              <img src="/gymfog-logo.jpeg" alt="GYM FOG" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-display italic tracking-tighter group-hover:text-accent transition-colors">
              GYM FOG
            </h1>
          </Link>

          {/* Right Actions */}
          <div className={`flex items-center gap-1 sm:gap-2 flex-1 justify-end ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Language Selector */}
            <LanguageSelector />

            {/* Account Button */}
            <Link href={isLoggedIn ? "/profile" : "/auth"}>
              <Button variant="ghost" size="icon" className={`hover:text-accent h-9 w-9 sm:h-10 sm:w-10 ${isLoggedIn ? "text-accent" : ""}`}>
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </Link>

            {/* Favorites Button */}
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="hover:text-accent relative h-9 w-9 sm:h-10 sm:w-10">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* Cart Button */}
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-accent relative h-9 w-9 sm:h-10 sm:w-10">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-black text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-l border-white/10 w-full sm:w-[400px] p-4 sm:p-6">
                <SheetHeader className={`mb-4 sm:mb-6 ${isRTL ? "text-right" : "text-left"}`}>
                  <SheetTitle className="text-xl sm:text-2xl italic font-display">{t.yourCart}</SheetTitle>
                </SheetHeader>
                {items.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t.cartEmpty}</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-[calc(100%-80px)]">
                    <div className="flex-1 overflow-auto space-y-4">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-3 sm:gap-4 border-b border-white/10 pb-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted overflow-hidden flex-shrink-0">
                            <img
                              src={getProductImageUrl(item.product)}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{item.product.title}</h4>
                            <p className="text-accent text-sm">{item.product.price_dzd.toLocaleString()} DA</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-transparent"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-transparent"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 ml-auto text-red-500 hover:text-red-400"
                                onClick={() => removeItem(item.product.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <div className={`flex justify-between text-lg font-bold mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <span>{t.total}:</span>
                        <span className="text-accent">{totalPrice.toLocaleString()} DA</span>
                      </div>
                      <Link href="/checkout" onClick={() => setCartOpen(false)}>
                        <Button className="w-full bg-accent text-black hover:bg-white h-12 font-display italic text-lg">
                          {t.checkout}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Mobile Menu */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-accent h-10 w-10 md:hidden">
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-l border-white/10 w-full sm:w-[300px]">
                <SheetHeader className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
                  <SheetTitle className="text-3xl sm:text-4xl italic font-display">{t.menu}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 text-xl sm:text-2xl font-display italic">
                  <a href="#shop" onClick={() => setMenuOpen(false)} className={`hover:text-accent transition-all ${isRTL ? "hover:-translate-x-2" : "hover:translate-x-2"}`}>
                    {t.shop}
                  </a>
                  <a href="#story" onClick={() => setMenuOpen(false)} className={`hover:text-accent transition-all ${isRTL ? "hover:-translate-x-2" : "hover:translate-x-2"}`}>
                    {t.ourStory}
                  </a>
                  <a href="#contact" onClick={() => setMenuOpen(false)} className={`hover:text-accent transition-all ${isRTL ? "hover:-translate-x-2" : "hover:translate-x-2"}`}>
                    {t.contactUs}
                  </a>
                  <div className="pt-6 border-t border-white/10">
                    <p className={`text-[10px] tracking-[0.2em] font-bold text-muted-foreground mb-4 not-italic ${isRTL ? "text-right" : ""}`}>{t.categories}</p>
                    <div className="flex flex-col gap-3">
                      {categoryOptions.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id)
                            setMenuOpen(false)
                          }}
                          className={`text-left text-lg hover:text-accent transition-colors ${
                            selectedCategory === cat.id ? 'text-accent' : ''
                          }`}
                        >
                          {cat.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Mobile First */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <motion.img
            src="/boxing-training-in-dark-gym-intense.jpg"
            alt="Hero background"
            className="w-full h-full object-cover opacity-60 grayscale"
            initial={{ scale: 1.2, filter: "grayscale(100%) brightness(0.2)" }}
            animate={{ scale: 1, filter: "grayscale(100%) brightness(0.6)" }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.h2
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: "backOut" }}
            className="text-[10vw] sm:text-[8vw] lg:text-[7vw] leading-[0.85] font-display italic mb-6"
          >
            {t.testedByFighters}
            <br />
            <span className="text-accent">{t.forFighters}</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 ${isRTL ? "sm:flex-row-reverse" : ""}`}
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary text-white hover:bg-accent hover:text-black text-base sm:text-xl px-8 sm:px-12 h-12 sm:h-16 font-display italic"
              onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.shopCombatGear}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-black text-base sm:text-xl px-8 sm:px-12 h-12 sm:h-16 font-display italic bg-transparent"
            >
              <Play className={`h-4 w-4 sm:h-5 sm:w-5 fill-current ${isRTL ? "ml-2" : "mr-2"}`} /> {t.brandStory}
            </Button>
          </motion.div>
        </div>

        {/* Scrolling Banner */}
        <div className="absolute bottom-0 w-full bg-accent text-black py-2 overflow-hidden whitespace-nowrap border-y border-black font-bold text-xs sm:text-sm">
          <div className="flex animate-[scroll_20s_linear_infinite]">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-4 sm:mx-8">
                DURABILITY * PERFORMANCE * COMBAT TESTED * FAIR PRICING * BUILT BY FIGHTERS *
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Section - Mobile First */}
      <section id="shop" className="py-12 sm:py-24 bg-black overflow-hidden">
        <div className="container mx-auto px-4 mb-6 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 sm:gap-8"
          >
            <div className={isRTL ? "text-right" : ""}>
              <p className="text-accent font-bold mb-1 sm:mb-2 tracking-[0.2em] text-xs sm:text-sm">{t.equipment}</p>
              <h3 className="text-3xl sm:text-5xl lg:text-6xl italic">{t.gearUpForWar}</h3>
            </div>
            {/* Category Filter - Horizontal Scroll on Mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-2 text-xs font-bold border transition-all ${
                    selectedCategory === cat.id ? "bg-accent text-black border-accent" : "bg-transparent border-white/10 hover:border-white/30"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-xl">{t.noProductsFound}</p>
            <p className="text-sm mt-2">{t.checkBackSoon}</p>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id}>
                  <Card className="group bg-muted border-none overflow-hidden hover:ring-2 hover:ring-accent transition-all duration-300 cursor-pointer h-full">
                    <CardContent className="p-0 aspect-square relative overflow-hidden">
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                      />
                      <div className={`absolute top-2 ${isRTL ? "right-2 sm:right-4" : "left-2 sm:left-4"}`}>
                        <Badge className="bg-primary text-white rounded-none italic font-display text-[10px] sm:text-xs px-2 py-1">
                          {getCategoryTitle(product.category)}
                        </Badge>
                      </div>
                      {/* Favorite Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`absolute top-2 ${isRTL ? "left-2 sm:left-4" : "right-2 sm:right-4"} h-8 w-8 sm:h-10 sm:w-10 bg-black/50 hover:bg-black/70 ${
                          isFavorite(product.id) ? "text-red-500" : "text-white"
                        }`}
                        onClick={(e) => handleToggleFavorite(product, e)}
                      >
                        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                      </Button>
                      {product.stock_quantity <= 0 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="text-red-500 font-bold text-xs sm:text-lg">{t.outOfStock}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col p-3 sm:p-4 bg-muted/50 backdrop-blur-sm gap-2 sm:gap-3">
                      <div className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
                        <h4 className="font-display italic text-sm sm:text-lg truncate">{product.title}</h4>
                        <p className="text-accent font-bold text-xs sm:text-base">{product.price_dzd.toLocaleString()} DA</p>
                      </div>
                      {/* Action Buttons */}
                      <div className={`flex gap-2 w-full ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-white/20 hover:bg-white hover:text-black bg-transparent text-[10px] sm:text-xs h-8 sm:h-9"
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={product.stock_quantity <= 0}
                        >
                          <ShoppingCart className={`h-3 w-3 sm:h-4 sm:w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                          <span className="hidden sm:inline">{t.addToCart}</span>
                          <span className="sm:hidden">Cart</span>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-accent text-black hover:bg-white text-[10px] sm:text-xs h-8 sm:h-9"
                          onClick={(e) => handleBuyNow(product, e)}
                          disabled={product.stock_quantity <= 0}
                        >
                          <Zap className={`h-3 w-3 sm:h-4 sm:w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                          <span className="hidden sm:inline">{t.buyNow}</span>
                          <span className="sm:hidden">Buy</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Story Section - Mobile First with Updated Bio */}
      <section id="story" className="py-12 sm:py-24 bg-muted relative overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="relative w-full max-w-sm mx-auto md:max-w-none aspect-[3/4] overflow-hidden border-2 border-accent"
          >
            <img src="/images/chikhb.png" alt="Coach Remilaoui Ibrahim" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-accent text-black p-3 sm:p-4 font-display italic text-lg sm:text-xl text-center md:text-left">
              COACH REMILAOUI IBRAHIM
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`text-center ${isRTL ? "md:text-right" : "md:text-left"}`}
          >
            <h3 className="text-3xl sm:text-4xl lg:text-5xl italic mb-4 sm:mb-6">
              {t.builtBy}
              <br />
              <span className="text-accent">{t.trueChampion}</span>
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              {t.coachBio}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - Mobile First */}
      <section id="contact" className="py-12 sm:py-24 bg-black border-t border-white/10">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-3xl sm:text-5xl italic mb-2">{t.contactUs}</h3>
            <p className="text-muted-foreground font-bold tracking-widest text-[10px] sm:text-xs">{t.directLine}</p>
          </div>
          <div className="space-y-4">
            <Textarea
              placeholder={t.writeMessage}
              className={`min-h-[120px] sm:min-h-[150px] bg-muted border-none text-base sm:text-lg p-4 sm:p-6 focus-visible:ring-accent ${isRTL ? "text-right" : ""}`}
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              dir={isRTL ? "rtl" : "ltr"}
            />
            <Button
              size="lg"
              className="w-full bg-accent text-black hover:bg-white text-base sm:text-xl h-12 sm:h-16 font-display italic"
              onClick={() => openWhatsApp(whatsappMessage)}
            >
              <MessageCircle className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t.sendWhatsApp}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Mobile First */}
      <footer className="bg-muted border-t border-white/10 pt-12 sm:pt-24 pb-8 sm:pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-16">
            <div className="sm:col-span-2 text-center sm:text-left">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 justify-center sm:justify-start">
                <div className="w-12 h-12 sm:w-16 sm:h-16 relative overflow-hidden border border-white/10">
                  <img src="/gymfog-logo.jpeg" alt="GYM FOG" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-display italic">GYM FOG</h2>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6 sm:mb-8 mx-auto sm:mx-0 text-sm sm:text-base">
                The premier combat sports brand for the dedicated. Tested by fighters, built for the grind. Based in Algeria.
              </p>
              <div className="flex gap-4 justify-center sm:justify-start">
                <Button variant="ghost" size="icon" className="hover:text-accent">
                  <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-accent">
                  <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-accent"
                  onClick={() => openWhatsApp()}
                  title="Contact via WhatsApp"
                >
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </div>
            <div className={`text-center ${isRTL ? "sm:text-right" : "sm:text-left"}`}>
              <h5 className="font-bold mb-4 sm:mb-6 text-accent text-sm">{t.resources}</h5>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm font-medium">
                <li><a href="#" className="hover:text-accent">{t.sizeGuides}</a></li>
                <li><a href="#" className="hover:text-accent">{t.shippingPolicy}</a></li>
                <li><a href="#contact" className="hover:text-accent">{t.contactUs}</a></li>
                <li><a href="#" className="hover:text-accent">{t.bulkOrders}</a></li>
              </ul>
            </div>
            <div className={`text-center ${isRTL ? "sm:text-right" : "sm:text-left"}`}>
              <h5 className="font-bold mb-4 sm:mb-6 text-accent text-sm">{t.joinTheWar}</h5>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 font-medium">{t.subscribeAlerts}</p>
              <div className={`flex gap-2 max-w-xs mx-auto ${isRTL ? "sm:ml-auto sm:mr-0 flex-row-reverse" : "sm:mx-0"}`}>
                <input
                  className={`bg-black border border-white/10 px-3 sm:px-4 py-2 flex-1 text-xs sm:text-sm outline-none focus:border-accent min-w-0 ${isRTL ? "text-right" : ""}`}
                  placeholder={t.emailAddress}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <Button className="bg-accent text-black font-bold rounded-none px-4 sm:px-6 text-xs sm:text-sm">GO</Button>
              </div>
            </div>
          </div>
          <div className={`pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] sm:text-[10px] tracking-[0.2em] text-muted-foreground font-bold ${isRTL ? "sm:flex-row-reverse" : ""}`}>
            <p>2026 GYM FOG. {t.allRightsReserved}</p>
            <div className={`flex gap-4 sm:gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
              <a href="#" className="hover:text-accent">{t.privacy}</a>
              <a href="#" className="hover:text-accent">{t.terms}</a>
              <a href="#" className="hover:text-accent">ALGERIA</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
