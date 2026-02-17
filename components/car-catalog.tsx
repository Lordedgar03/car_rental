"use client"

import { useMemo, useState } from "react"
import { CarCard } from "@/components/car-card"
import { Button } from "@/components/ui/button"
import type { Car } from "@/lib/types"
import { buildWhatsAppLink } from "@/lib/contact"
import { Car as CarIcon, Sparkles } from "lucide-react"

type Props = {
  cars: Car[]
}

/**
 * Se quiseres forçar categorias “fixas”, mete aqui.
 * Caso contrário, o componente gera categorias a partir do BD.
 */
const FALLBACK_CATEGORIES = ["SUV", "Sedan", "Esportivo", "Pickup", "Compacto"] as const

export function CarCatalog({ cars }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("Todos")

  // ✅ env em Client Component: apenas NEXT_PUBLIC_*
  const whatsappE164 = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP_E164 ?? ""
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "RC Veículos"

  const generalWa = useMemo(() => {
    if (!whatsappE164) return "#"
    return buildWhatsAppLink(whatsappE164, `Olá! Vim pelo ${siteName}. Preciso de ajuda para escolher um carro.`)
  }, [whatsappE164, siteName])

  // ✅ só carros ativos e disponíveis
  const activeCars = useMemo(() => {
    return (cars ?? []).filter((car) => car.isActive && car.availabilityStatus === "available")
  }, [cars])

  // ✅ categorias: "Todos" + categorias reais encontradas + fallback (se não existir nada)
  const categories = useMemo(() => {
    const set = new Set<string>()

    for (const c of activeCars) {
      const cat = (c.category ?? "").trim()
      if (cat) set.add(cat)
    }

    // se BD vier vazio, usa fallback
    if (set.size === 0) {
      for (const f of FALLBACK_CATEGORIES) set.add(String(f))
    }

    return ["Todos", ...Array.from(set).sort((a, b) => a.localeCompare(b, "pt"))]
  }, [activeCars])

  // ✅ lista filtrada por categoria selecionada
  const filteredCars = useMemo(() => {
    if (activeCategory === "Todos") return activeCars
    return activeCars.filter((car) => car.category === activeCategory)
  }, [activeCars, activeCategory])

  // ✅ se a categoria atual deixar de existir (ex: mudou a lista do BD), volta pra "Todos"
  // (não uso useEffect para não introduzir risco de hidratação; isso é só lógica local)
  const safeActiveCategory = categories.includes(activeCategory) ? activeCategory : "Todos"

  return (
    <section id="veiculos" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-primary/3 to-transparent rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <CarIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Minha Frota</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-balance">
            Carros Disponíveis para <span className="gradient-text">Locação</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Todos os carros são bem cuidados e passam por revisão antes de cada locação. Escolha o que mais combina com
            você!
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                safeActiveCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Car Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-secondary/50 rounded-2xl flex items-center justify-center">
              <CarIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">Nenhum carro disponível nesta categoria no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredCars.map((car, index) => (
              <div key={car.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CarCard car={car} />
              </div>
            ))}
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="relative mt-16 p-8 lg:p-12 glass rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Atendimento Personalizado</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Não encontrou o que procura?</h3>
              <p className="text-muted-foreground">Me envie uma mensagem e vou te ajudar a encontrar o carro ideal!</p>
            </div>

            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
              asChild
              disabled={!whatsappE164}
              title={!whatsappE164 ? "Configure NEXT_PUBLIC_CONTACT_WHATSAPP_E164 no .env" : undefined}
            >
              <a href={generalWa} target="_blank" rel="noopener noreferrer">
                Falar sobre outro carro
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
