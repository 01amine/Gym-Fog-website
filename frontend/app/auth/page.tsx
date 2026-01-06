"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, Eye, EyeOff, Dumbbell } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      // TODO: Implement actual login API call
      // For now, simulate login
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store user session in localStorage (temporary)
      localStorage.setItem("gymfog_user", JSON.stringify({
        email: loginData.email,
        name: loginData.email.split("@")[0],
      }))

      toast.success("Welcome back!")
      router.push("/")
    } catch (error) {
      toast.error("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerData.name || !registerData.email || !registerData.phone || !registerData.password) {
      toast.error("Please fill in all required fields")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      // TODO: Implement actual registration API call
      // For now, simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store user session in localStorage (temporary)
      localStorage.setItem("gymfog_user", JSON.stringify({
        email: registerData.email,
        name: registerData.name,
        phone: registerData.phone,
      }))

      toast.success("Account created successfully!")
      router.push("/")
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-accent transition-colors">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-bold hidden sm:inline">BACK TO SHOP</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 relative overflow-hidden border border-white/20">
              <img src="/gymfog-logo.jpeg" alt="GYM FOG" className="w-full h-full object-cover" />
            </div>
            <span className="text-base sm:text-lg font-display italic">GYM FOG</span>
          </Link>
          <div className="w-20 sm:w-24" />
        </div>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
        <Card className="w-full max-w-md bg-muted border-white/10">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-accent/10 rounded-full">
                <Dumbbell className="w-8 h-8 text-accent" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-display italic">JOIN THE FIGHT</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/50 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-accent data-[state=active]:text-black font-bold">
                  LOGIN
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-accent data-[state=active]:text-black font-bold">
                  REGISTER
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="bg-black border-white/10 focus:border-accent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="bg-black border-white/10 focus:border-accent pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-black hover:bg-white h-12 font-display italic text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        SIGNING IN...
                      </>
                    ) : (
                      "SIGN IN"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name *</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Your full name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="bg-black border-white/10 focus:border-accent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="bg-black border-white/10 focus:border-accent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Phone Number *</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="0555 12 34 56"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="bg-black border-white/10 focus:border-accent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="bg-black border-white/10 focus:border-accent pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password *</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="bg-black border-white/10 focus:border-accent"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-black hover:bg-white h-12 font-display italic text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        CREATING ACCOUNT...
                      </>
                    ) : (
                      "CREATE ACCOUNT"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
