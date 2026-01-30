import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Provider from "./provider"
import { Toaster } from "@/components/ui/toaster"
import { KeepAlive } from "@/components/keep-alive"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GymFog - Admin Panel",
  description: "GymFog Admin Dashboard",
  icons: {
    icon: "/gymfog-logo.jpeg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950`}>
        <Provider>
          <main>
            {children}
          </main>
          <Toaster />
          <KeepAlive />
        </Provider>
      </body>
    </html>
  )
}
