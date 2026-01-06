"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, ShoppingCart, Package, FolderOpen, Users, Bell, Dumbbell } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

// GymFog Logo Component
const GymFogLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      <Dumbbell className="w-8 h-8 text-yellow-500" />
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-bold tracking-tight text-yellow-500">GYM</span>
      <span className="text-xs font-medium tracking-widest text-gray-400 -mt-1">FOG</span>
    </div>
  </div>
)

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Categories", href: "/categories", icon: FolderOpen },
    { name: "Products", href: "/products", icon: Package },
    { name: "Users", href: "/users", icon: Users },
  ]

  const NavigationItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start transition-all duration-200 ${
                isActive
                  ? "bg-yellow-500 text-black hover:bg-yellow-400"
                  : "text-gray-300 hover:text-yellow-500 hover:bg-zinc-800"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.name}
            </Button>
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-gray-300 hover:text-yellow-500">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-zinc-900 border-zinc-800">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-zinc-800">
                    <GymFogLogo />
                  </div>
                  <nav className="flex-1 p-4 space-y-2">
                    <NavigationItems />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <GymFogLogo />
            <div className="hidden lg:block h-8 w-px bg-zinc-700" />
            <h1 className="hidden lg:block text-xl font-semibold text-gray-100">Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-yellow-500">
              <Bell className="w-5 h-5" />
            </Button>
            <Avatar className="w-8 h-8 lg:w-10 lg:h-10 border-2 border-yellow-500">
              <AvatarImage src="/admin-avatar.png" />
              <AvatarFallback className="bg-zinc-800 text-yellow-500">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen">
          <nav className="p-4 space-y-2">
            <NavigationItems />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  )
}
