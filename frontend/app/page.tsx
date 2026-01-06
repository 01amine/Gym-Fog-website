"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Play, Instagram, Facebook, MessageCircle, X, Check, Menu, Plus, Minus, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/lib/context/cart-context"
import { getProducts } from "@/lib/api/products"
import { getCategories } from "@/lib/api/categories"
import { Product, Category } from "@/lib/types"
import Link from "next/link"
import { toast } from "sonner"

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [whatsappMessage, setWhatsappMessage] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)

  const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, getItemQuantity } = useCart()

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

  const categoryNames = useMemo(() => {
    const names = ["ALL", ...categories.map(c => c.title.toUpperCase())]
    return names
  }, [categories])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "ALL") return products
    return products.filter((p) => p.category.toUpperCase() === selectedCategory)
  }, [selectedCategory, products])

  const openWhatsApp = (productName?: string) => {
    const message = productName
      ? `Hello GYM FOG! I am interested in the ${productName}. Can you give me more details?`
      : "Hello GYM FOG! I'd like to inquire about your gear and gym memberships."
    window.open(`https://wa.me/213000000000?text=${encodeURIComponent(message)}`, "_blank")
  }

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation()
    addItem(product)
    toast.success(`${product.title} added to cart`)
  }

  const getProductImageUrl = (product: Product) => {
    if (product.image_urls && product.image_urls.length > 0) {
      return product.image_urls[0]
    }
    return `/placeholder.jpg?height=600&width=600&query=${product.title}`
  }

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
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
              className="w-48 h-48 relative overflow-hidden"
            >
              <img src="/gymfog-logo.jpeg" alt="GYM FOG Logo" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
        className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
      >
        <div className="container mx-auto px-4 h-20 grid grid-cols-3 items-center">
          <div className="flex items-center">
            <div className="hidden md:flex items-center gap-6 text-[10px] font-bold tracking-widest">
              <a href="#shop" className="hover:text-accent transition-colors">
                SHOP
              </a>
              <a href="#story" className="hover:text-accent transition-colors">
                OUR STORY
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 relative overflow-hidden border border-white/20 group-hover:scale-110 transition-transform duration-300">
              <img src="/gymfog-logo.jpeg" alt="GYM FOG" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl md:text-2xl font-display italic tracking-tighter group-hover:text-accent transition-colors">
              GYM FOG
            </h1>
          </div>

          <div className="flex items-center justify-end gap-4">
            {/* Cart Button */}
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-accent relative">
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-l border-white/10 w-[350px] sm:w-[400px]">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="text-2xl italic font-display">YOUR CART</SheetTitle>
                </SheetHeader>
                {items.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-[calc(100%-80px)]">
                    <div className="flex-1 overflow-auto space-y-4">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-4 border-b border-white/10 pb-4">
                          <div className="w-20 h-20 bg-muted overflow-hidden">
                            <img
                              src={getProductImageUrl(item.product)}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm">{item.product.title}</h4>
                            <p className="text-accent text-sm">{item.product.price_dzd} DA</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto text-red-500 hover:text-red-400"
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
                      <div className="flex justify-between text-lg font-bold mb-4">
                        <span>Total:</span>
                        <span className="text-accent">{totalPrice} DA</span>
                      </div>
                      <Link href="/checkout" onClick={() => setCartOpen(false)}>
                        <Button className="w-full bg-accent text-black hover:bg-white h-12 font-display italic text-lg">
                          CHECKOUT
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-accent">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-l border-white/10 w-[300px]">
                <SheetHeader className="text-left mb-12">
                  <SheetTitle className="text-4xl italic font-display">NAVIGATION</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-8 text-2xl font-display italic">
                  <a href="#shop" className="hover:text-accent transition-all hover:translate-x-2">
                    SHOP
                  </a>
                  <a href="#story" className="hover:text-accent transition-all hover:translate-x-2">
                    OUR STORY
                  </a>
                  <a href="#contact" className="hover:text-accent transition-all hover:translate-x-2">
                    CONTACT US
                  </a>
                  <div className="pt-8 border-t border-white/10">
                    <p className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground mb-4">CATEGORIES</p>
                    <div className="flex flex-col gap-4">
                      {categoryNames.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className="text-left hover:text-accent transition-colors"
                        >
                          {cat}
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

      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <motion.img
            src="/boxing-training-in-dark-gym-intense.jpg"
            alt="Hero background"
            className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
            initial={{ scale: 1.2, filter: "grayscale(100%) brightness(0.2)" }}
            animate={{ scale: 1, filter: "grayscale(100%) brightness(0.6)" }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.h2
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: "backOut" }}
            className="text-[12vw] leading-[0.8] font-display italic mb-6 animate-in fade-in slide-in-from-bottom-12 duration-1000"
          >
            TESTED BY FIGHTERS
            <br />
            <span className="text-accent">FOR FIGHTERS</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8"
          >
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-accent hover:text-black text-xl px-12 h-16 font-display italic"
              onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            >
              SHOP COMBAT GEAR
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black text-xl px-12 h-16 font-display italic bg-transparent"
            >
              <Play className="mr-2 h-5 w-5 fill-current" /> WATCH BRAND STORY
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-0 w-full bg-accent text-black py-2 overflow-hidden whitespace-nowrap border-y border-black font-bold text-sm">
          <div className="flex animate-[scroll_20s_linear_infinite]">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-8">
                DURABILITY * PERFORMANCE * REAL COMBAT CREDIBILITY * FAIR PRICING * BUILT BY FIGHTERS *
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" className="py-24 bg-black overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <p className="text-accent font-bold mb-2 tracking-[0.2em]">EQUIPMENT</p>
              <h3 className="text-6xl italic">GEAR UP FOR WAR</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryNames.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold border transition-all ${
                    selectedCategory === cat ? "bg-accent text-black border-accent" : "bg-transparent border-white/10"
                  }`}
                >
                  {cat}
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
            <p className="text-xl">No products found</p>
            <p className="text-sm mt-2">Check back soon for new gear!</p>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group bg-muted border-none overflow-hidden hover:ring-2 hover:ring-accent transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardContent className="p-0 aspect-square relative overflow-hidden">
                    <img
                      src={getProductImageUrl(product)}
                      alt={product.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white rounded-none italic font-display">
                        {product.category}
                      </Badge>
                    </div>
                    {product.stock_quantity <= 0 && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-red-500 font-bold text-lg">OUT OF STOCK</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-6 bg-muted/50 backdrop-blur-sm">
                    <div>
                      <h4 className="font-display italic text-xl">{product.title}</h4>
                      <p className="text-accent font-bold">{product.price_dzd} DA</p>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-white/20 hover:bg-accent hover:text-black bg-transparent"
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stock_quantity <= 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>

      <section id="story" className="py-24 bg-muted relative overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] md:aspect-square overflow-hidden border-2 border-accent"
          >
            <img src="/images/chikhb.png" alt="Remilaoui Ibrahim" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 bg-accent text-black p-4 font-display italic text-2xl">
              FOUNDER: REMILAOUI IBRAHIM
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-5xl italic mb-6">
              TESTED BY
              <br />
              <span className="text-accent">A TRUE FIGHTER.</span>
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium">
              Remilaoui Ibrahim, a National Vice-Champion, founded GYM FOG with a simple mission: to provide the gear he
              wished he had when starting. Every product is personally vetted for durability and performance in the heat
              of battle.
            </p>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-black border-t border-white/10">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h3 className="text-5xl italic mb-2">WHATSAPP US</h3>
            <p className="text-muted-foreground font-bold tracking-widest text-xs">DIRECT LINE TO THE HQ</p>
          </div>
          <div className="space-y-4">
            <Textarea
              placeholder="WRITE YOUR MESSAGE HERE..."
              className="min-h-[150px] bg-muted border-none text-lg p-6 focus-visible:ring-accent"
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
            />
            <Button
              size="lg"
              className="w-full bg-accent text-black hover:bg-white text-xl h-16 font-display italic"
              onClick={() => openWhatsApp(whatsappMessage)}
            >
              SEND WHATSAPP MESSAGE
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-muted border-t border-white/10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 relative overflow-hidden border border-white/10">
                  <img src="/gymfog-logo.jpeg" alt="GYM FOG" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-4xl font-display italic">GYM FOG</h2>
              </div>
              <p className="text-muted-foreground max-w-sm mb-8">
                The premier combat sports brand for the dedicated. Tested by fighters, built for the grind. Based in
                Algeria.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="hover:text-accent">
                  <Instagram className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-accent">
                  <Facebook className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-accent"
                  onClick={() => openWhatsApp()}
                  title="Contact via WhatsApp"
                >
                  <MessageCircle className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-accent">RESOURCES</h5>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <a href="#" className="hover:text-accent">
                    SIZE GUIDES
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    SHIPPING POLICY
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    WHATSAPP CONTACT
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    BULK ORDERS
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-accent">JOIN THE WAR</h5>
              <p className="text-sm text-muted-foreground mb-4 font-medium">SUBSCRIBE FOR DROP ALERTS & TECHNIQUES.</p>
              <div className="flex gap-2">
                <input
                  className="bg-black border border-white/10 px-4 py-2 flex-1 text-sm outline-none focus:border-accent"
                  placeholder="EMAIL ADDRESS"
                />
                <Button className="bg-accent text-black font-bold rounded-none px-6">GO</Button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.2em] text-muted-foreground font-bold">
            <p>2026 GYM FOG. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <a href="#">PRIVACY</a>
              <a href="#">TERMS</a>
              <a href="#">ALGERIA</a>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="relative w-full max-w-5xl bg-black border border-white/10 grid md:grid-cols-2 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-accent hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="aspect-square relative group">
                <img
                  src={getProductImageUrl(selectedProduct)}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <Badge className="bg-accent text-black rounded-none w-fit mb-4 font-bold tracking-widest">
                  {selectedProduct.category}
                </Badge>
                <h2 className="text-5xl italic leading-none mb-4">{selectedProduct.title}</h2>
                <p className="text-accent text-3xl font-display italic mb-8">
                  {selectedProduct.price_dzd} DA
                </p>

                <div className="space-y-6 mb-10">
                  <p className="text-muted-foreground text-lg">{selectedProduct.description}</p>
                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Sizes: {selectedProduct.sizes.join(", ")}</span>
                    </div>
                  )}
                  {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Colors: {selectedProduct.colors.join(", ")}</span>
                    </div>
                  )}
                  {selectedProduct.brand && (
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Brand: {selectedProduct.brand}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <Check className="w-4 h-4 text-accent" />
                    <span>Stock: {selectedProduct.stock_quantity > 0 ? `${selectedProduct.stock_quantity} available` : 'Out of stock'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {getItemQuantity(selectedProduct.id) > 0 ? (
                    <div className="flex items-center justify-center gap-4 bg-muted p-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-transparent"
                        onClick={() => updateQuantity(selectedProduct.id, getItemQuantity(selectedProduct.id) - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-bold w-12 text-center">{getItemQuantity(selectedProduct.id)}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-transparent"
                        onClick={() => updateQuantity(selectedProduct.id, getItemQuantity(selectedProduct.id) + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="bg-accent text-black hover:bg-white h-16 text-xl font-display italic w-full"
                      onClick={() => handleAddToCart(selectedProduct)}
                      disabled={selectedProduct.stock_quantity <= 0}
                    >
                      {selectedProduct.stock_quantity <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                    </Button>
                  )}
                  <p className="text-[10px] text-center text-muted-foreground tracking-widest font-bold">
                    SHIPPING ACROSS ALGERIA * SECURE PACKAGING
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
