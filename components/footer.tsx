import Link from "next/link"
import { Car, Instagram, MessageCircle, ArrowUpRight, Heart } from "lucide-react"

const quickLinks = [
  { label: "Carros", href: "#veiculos" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Sobre Mim", href: "#sobre" },
  { label: "Contato", href: "#contato" },
]

export function Footer() {
  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight leading-none">Veiculos D'Almeida</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Locacao Premium</span>
              </div>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm mb-6">
              Locacao de veiculos com atendimento personalizado em Sao Paulo.
              Carros revisados, precos justos e suporte durante todo o periodo.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-5">Navegacao</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  Area Administrativa
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-5">Contato</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Sao Tomé</p>
              <p>(+239) 99999-9999</p>
              <p>veiculosalmeida@gamil.com</p>
              <p className="pt-2 text-xs">Atendimento: 7h as 22h</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-primary fill-primary" /> por Veiculos D'Almeida
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Veiculos D'Almeida. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
