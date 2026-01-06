import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/context/cart-context'
import { FavoritesProvider } from '@/lib/context/favorites-context'
import { LanguageProvider } from '@/lib/context/language-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'GYM FOG - Combat Sports Gear',
  description: 'Premium combat sports equipment tested by fighters, for fighters. Based in Algeria.',
  icons: {
    icon: '/gymfog-logo.jpeg',
    shortcut: '/gymfog-logo.jpeg',
    apple: '/gymfog-logo.jpeg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          <CartProvider>
            <FavoritesProvider>
              {children}
              <Toaster />
            </FavoritesProvider>
          </CartProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
