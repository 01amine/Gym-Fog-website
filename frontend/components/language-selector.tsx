"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage, Language } from "@/lib/context/language-context"
import { ChevronDown } from "lucide-react"

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "/images/english.png" },
  { code: "fr", name: "Français", flag: "/images/french.png" },
  { code: "ar", name: "العربية", flag: "/images/arabic.png" },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((l) => l.code === language) || languages[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/10 rounded transition-colors"
      >
        <img
          src={currentLanguage.flag}
          alt={currentLanguage.name}
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm object-cover"
        />
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-black border border-white/20 rounded-md shadow-xl overflow-hidden z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 transition-colors ${
                language === lang.code ? "bg-accent/20 text-accent" : ""
              }`}
            >
              <img
                src={lang.flag}
                alt={lang.name}
                className="w-5 h-5 rounded-sm object-cover"
              />
              <span className="text-sm font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
