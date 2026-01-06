"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Phone, LogOut, Package, Heart, Settings, Edit2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useLanguage } from "@/lib/context/language-context"
import { LanguageSelector } from "@/components/language-selector"

interface UserData {
  name: string
  email: string
  phone?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { t, isRTL } = useLanguage()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("gymfog_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/auth")
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("gymfog_user")
    toast.success(t.logout)
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className={`flex items-center gap-2 hover:text-accent transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
            <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? "rotate-180" : ""}`} />
            <span className="text-xs sm:text-sm font-bold hidden sm:inline">{t.backToShop}</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 relative overflow-hidden border border-white/20">
              <img src="/gymfog-logo.jpeg" alt="GYM FOG" className="w-full h-full object-cover" />
            </div>
            <span className="text-base sm:text-lg font-display italic">GYM FOG</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="flex-1 pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-accent/20 rounded-full mb-4">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display italic">{t.profile}</h1>
            <p className="text-muted-foreground mt-1">{t.welcomeBack}</p>
          </div>

          {/* User Info Card */}
          <Card className="bg-muted border-white/10 mb-6">
            <CardHeader className={`pb-2 ${isRTL ? "text-right" : ""}`}>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <User className="w-5 h-5 text-accent" />
                {user.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm sm:text-base">{user.email}</span>
              </div>
              {user.phone && (
                <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm sm:text-base">{user.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <Link href="/favorites">
              <Card className="bg-muted border-white/10 hover:border-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-accent mb-2" />
                  <span className="font-bold text-sm sm:text-base">{t.favorites}</span>
                </CardContent>
              </Card>
            </Link>
            <Card className="bg-muted border-white/10 hover:border-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center text-center">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-accent mb-2" />
                <span className="font-bold text-sm sm:text-base">{t.myOrders}</span>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <Card className="bg-muted border-white/10 mb-6">
            <CardContent className="p-0">
              <button className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors border-b border-white/10 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                <Edit2 className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1">{t.profile} {t.settings}</span>
                <ArrowLeft className={`w-4 h-4 text-muted-foreground ${isRTL ? "" : "rotate-180"}`} />
              </button>
              <button className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1">{t.settings}</span>
                <ArrowLeft className={`w-4 h-4 text-muted-foreground ${isRTL ? "" : "rotate-180"}`} />
              </button>
            </CardContent>
          </Card>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400 h-12"
          >
            <LogOut className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t.logout}
          </Button>
        </div>
      </main>
    </div>
  )
}
