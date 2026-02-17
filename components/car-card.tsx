"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, Fuel, Settings, MessageCircle, Mail, Sparkles } from "lucide-react"
import type { Car } from "@/lib/types"
import { buildInquiryMessage, buildMailtoLink, buildWhatsAppLink } from "@/lib/contact"

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "RC Veículos"
  const whatsappE164 = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP_E164 ?? ""
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ""

  const message = buildInquiryMessage({
    siteName,
    carName: car.name,
    year: car.year,
    carId: car.id,
  })

  const waLink = whatsappE164 ? buildWhatsAppLink(whatsappE164, message) : "#"
  const mailLink = contactEmail
    ? buildMailtoLink(contactEmail, `Pedido de reserva: ${car.name}`, message)
    : "#"

  return (
    <div
      className={`group relative bg-card border rounded-2xl overflow-hidden card-hover ${
        car.featured ? "border-primary/30" : "border-border/50"
      }`}
    >
      {/* Featured badge with glow */}
      {car.featured && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold rounded-full shadow-lg shadow-primary/30">
          <Sparkles className="w-3 h-3" />
          Destaque
        </div>
      )}

      {/* Image container with overlay effects */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Image src={car.imageUrl || "/placeholder.svg"} alt={car.name} fill className="object-cover img-zoom" />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Year badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 glass rounded-lg text-xs font-semibold">
          {car.year}
        </div>
        
        {/* Category badge - bottom left */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium uppercase tracking-wider rounded-md">
          {car.category}
        </div>

        {car.availabilityStatus !== "available" && (
          <div className="absolute bottom-4 right-4 px-3 py-1 glass rounded-md text-xs font-semibold">
            {car.availabilityStatus === "maintenance" ? "Manutenção" : "Indisponível"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {car.name}
        </h3>
        
        {car.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {car.description}
          </p>
        )}

        {/* Features with better styling */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/70 rounded-lg text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{car.passengers}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/70 rounded-lg text-sm">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{car.transmission === "Automático" ? "Auto" : car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/70 rounded-lg text-sm">
            <Fuel className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{car.fuel}</span>
          </div>
        </div>

        {/* Price & CTA - improved layout */}
        <div className="flex items-center justify-between pt-5 border-t border-border/50">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-muted-foreground">STN</span>
              <span className="text-3xl font-bold gradient-text">{car.pricePerDay.toLocaleString("pt-pt")}</span>
            </div>
            <span className="text-xs text-muted-foreground">por dia</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="w-10 h-10 p-0 bg-transparent border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all duration-300"
              asChild
            >
              <a href={mailLink} aria-label="Pedir por e-mail">
                <Mail className="w-4 h-4" />
              </a>
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-10 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
              asChild
            >
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1.5 w-4 h-4" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
