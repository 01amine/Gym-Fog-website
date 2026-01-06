"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ShoppingCart, Loader2, CheckCircle, X, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/context/cart-context"
import { createGuestOrder } from "@/lib/api/orders"
import { WILAYAS, GuestOrderCreate } from "@/lib/types"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart, updateQuantity, removeItem } = useCart()
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    guest_name: "",
    guest_phone: "",
    guest_email: "",
    delivery_address: "",
    wilaya: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.guest_name.trim()) {
      newErrors.guest_name = "Name is required"
    }

    if (!formData.guest_phone.trim()) {
      newErrors.guest_phone = "Phone number is required"
    } else if (!/^(0|\+213)[567][0-9]{8}$/.test(formData.guest_phone.replace(/\s/g, ""))) {
      newErrors.guest_phone = "Enter a valid Algerian phone number"
    }

    if (formData.guest_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guest_email)) {
      newErrors.guest_email = "Enter a valid email address"
    }

    if (!formData.delivery_address.trim()) {
      newErrors.delivery_address = "Delivery address is required"
    }

    if (!formData.wilaya) {
      newErrors.wilaya = "Please select a wilaya"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setLoading(true)

    try {
      const orderData: GuestOrderCreate = {
        guest_name: formData.guest_name.trim(),
        guest_phone: formData.guest_phone.trim(),
        guest_email: formData.guest_email.trim() || undefined,
        delivery_address: formData.delivery_address.trim(),
        wilaya: formData.wilaya,
        delivery_type: "delivery",
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      }

      const response = await createGuestOrder(orderData)
      setOrderId(response.id)
      setOrderSuccess(true)
      clearCart()
      toast.success("Order placed successfully!")
    } catch (error: unknown) {
      console.error("Order failed:", error)
      const errorMessage = error && typeof error === 'object' && 'detail' in error
        ? String((error as { detail: unknown }).detail)
        : "Failed to place order. Please try again."
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getProductImageUrl = (imageUrls: string[]) => {
    if (imageUrls && imageUrls.length > 0) {
      return imageUrls[0]
    }
    return "/placeholder.jpg"
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-muted border-accent">
          <CardContent className="pt-12 pb-8 text-center">
            <CheckCircle className="w-20 h-20 text-accent mx-auto mb-6" />
            <h1 className="text-3xl font-display italic mb-4">ORDER CONFIRMED!</h1>
            <p className="text-muted-foreground mb-2">Thank you for your order.</p>
            <p className="text-sm text-muted-foreground mb-6">
              Order ID: <span className="text-accent font-mono">{orderId}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              We will contact you soon to confirm your order and arrange delivery.
            </p>
            <Link href="/">
              <Button className="bg-accent text-black hover:bg-white font-display italic">
                CONTINUE SHOPPING
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-muted border-white/10">
          <CardContent className="pt-12 pb-8 text-center">
            <ShoppingCart className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h1 className="text-3xl font-display italic mb-4">YOUR CART IS EMPTY</h1>
            <p className="text-muted-foreground mb-8">Add some gear to your cart before checkout.</p>
            <Link href="/">
              <Button className="bg-accent text-black hover:bg-white font-display italic">
                SHOP NOW
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-bold">BACK TO SHOP</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative overflow-hidden border border-white/20">
              <img src="/gymfog-logo.jpeg" alt="GYM FOG" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-lg font-display italic">CHECKOUT</h1>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Form */}
          <div>
            <Card className="bg-muted border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-display italic">DELIVERY DETAILS</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="guest_name">Full Name *</Label>
                    <Input
                      id="guest_name"
                      name="guest_name"
                      value={formData.guest_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="bg-black border-white/10 focus:border-accent"
                    />
                    {errors.guest_name && (
                      <p className="text-red-500 text-sm">{errors.guest_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guest_phone">Phone Number *</Label>
                    <Input
                      id="guest_phone"
                      name="guest_phone"
                      value={formData.guest_phone}
                      onChange={handleInputChange}
                      placeholder="0555 12 34 56"
                      className="bg-black border-white/10 focus:border-accent"
                    />
                    {errors.guest_phone && (
                      <p className="text-red-500 text-sm">{errors.guest_phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guest_email">Email (Optional)</Label>
                    <Input
                      id="guest_email"
                      name="guest_email"
                      type="email"
                      value={formData.guest_email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="bg-black border-white/10 focus:border-accent"
                    />
                    {errors.guest_email && (
                      <p className="text-red-500 text-sm">{errors.guest_email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wilaya">Wilaya *</Label>
                    <Select
                      value={formData.wilaya}
                      onValueChange={(value) => {
                        setFormData((prev) => ({ ...prev, wilaya: value }))
                        if (errors.wilaya) {
                          setErrors((prev) => ({ ...prev, wilaya: "" }))
                        }
                      }}
                    >
                      <SelectTrigger className="bg-black border-white/10 focus:border-accent">
                        <SelectValue placeholder="Select your wilaya" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/10 max-h-[300px]">
                        {WILAYAS.map((wilaya, index) => (
                          <SelectItem key={wilaya} value={wilaya}>
                            {index + 1}. {wilaya}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.wilaya && (
                      <p className="text-red-500 text-sm">{errors.wilaya}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery_address">Delivery Address *</Label>
                    <Input
                      id="delivery_address"
                      name="delivery_address"
                      value={formData.delivery_address}
                      onChange={handleInputChange}
                      placeholder="Street address, building, apartment..."
                      className="bg-black border-white/10 focus:border-accent"
                    />
                    {errors.delivery_address && (
                      <p className="text-red-500 text-sm">{errors.delivery_address}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-black hover:bg-white h-14 text-lg font-display italic"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        PLACING ORDER...
                      </>
                    ) : (
                      `PLACE ORDER - ${totalPrice} DA`
                    )}
                  </Button>

                  <p className="text-[10px] text-center text-muted-foreground tracking-widest">
                    PAYMENT ON DELIVERY * SHIPPING ACROSS ALGERIA
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-muted border-white/10 sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-display italic">ORDER SUMMARY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border-b border-white/10 pb-4">
                      <div className="w-20 h-20 bg-black overflow-hidden">
                        <img
                          src={getProductImageUrl(item.product.image_urls)}
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
                      <div className="text-right">
                        <p className="font-bold">{item.product.price_dzd * item.quantity} DA</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{totalPrice} DA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-accent">Calculated on delivery</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-accent">{totalPrice} DA</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
