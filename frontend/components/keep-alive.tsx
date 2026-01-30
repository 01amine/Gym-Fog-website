'use client'

import { useEffect } from 'react'

const PING_INTERVAL = 5 * 60 * 1000 // 5 minutes

export function KeepAlive() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) return

    const ping = async () => {
      try {
        await fetch(`${apiUrl}/docs`, { method: 'HEAD', mode: 'no-cors' })
      } catch {
        // Silently fail - just keeping the server awake
      }
    }

    // Initial ping
    ping()

    // Ping every 5 minutes
    const interval = setInterval(ping, PING_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return null
}
