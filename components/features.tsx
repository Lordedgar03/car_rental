import { Shield, Clock, MapPin, Headphones, CreditCard, Award } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Seguro Total",
    description: "Cobertura completa para você viajar com tranquilidade.",
  },
  {
    icon: Clock,
    title: "Reserva Flexível",
    description: "Cancele ou modifique sua reserva sem custos adicionais.",
  },
  {
    icon: MapPin,
    title: "Múltiplas Localizações",
    description: "Retire e devolva em qualquer uma de nossas 50+ unidades.",
  },
  {
    icon: Headphones,
    title: "Suporte 24/7",
    description: "Assistência completa a qualquer hora, todos os dias.",
  },
  {
    icon: CreditCard,
    title: "Pagamento Fácil",
    description: "Pague em até 12x sem juros ou com PIX com desconto.",
  },
  {
    icon: Award,
    title: "Qualidade Premium",
    description: "Veículos revisados e higienizados a cada locação.",
  },
]

export function Features() {
  return (
    <section id="vantagens" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Por que escolher a DriveX?
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
            Vantagens Exclusivas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Oferecemos uma experiência completa em locação de veículos, 
            com benefícios que fazem toda a diferença.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-primary/20">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
