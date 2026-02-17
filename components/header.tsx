"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Car, MessageCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#veiculos", label: "Carros" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
]

export function Header() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "RC Veiculos"
  const whatsappE164 = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP_E164 ?? ""
  const whatsappLink = whatsappE164
    ? `https://wa.me/${whatsappE164.replace(/[^\\d]/g, "")}`
    : "#"

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-background/10" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
              <Car className="w-6 h-6 text-primary-foreground" />
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none">{siteName}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Locacao Premium</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-1/2 transition-all duration-300" />
              </Link>
            ))}
            <Link
              href="/admin"
              className="ml-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-all duration-300"
            >
              Admin
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              className="btn-stp" /* Substituído pelo estilo personalizado */
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 w-4 h-4" />
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-secondary/50 text-foreground hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`absolute transition-all duration-300 ${isMenuOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"}`}>
              <Menu className="w-5 h-5" />
            </span>
            <span className={`absolute transition-all duration-300 ${isMenuOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"}`}>
              <X className="w-5 h-5" />
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <nav className="py-6 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            ))}
            <Link
              href="/admin"
              className="flex items-center justify-between px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Painel Admin
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Link>
            <div className="pt-4">
              <Button 
                className="w-full btn-stp" /* Estilo STP */
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}