import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Empresário",
    content:
      "Excelente experiência! O carro estava impecável e o atendimento foi excepcional. Com certeza vou alugar novamente.",
    rating: 5,
  },
  {
    name: "Ana Paula Santos",
    role: "Advogada",
    content:
      "Processo de reserva super simples e rápido. Retirei o carro em menos de 10 minutos. Recomendo a todos!",
    rating: 5,
  },
  {
    name: "Roberto Mendes",
    role: "Médico",
    content:
      "A DriveX oferece os melhores carros da região. Já aluguei várias vezes e nunca tive problemas.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            A satisfação de nossos clientes é nossa maior conquista. 
            Veja o que eles têm a dizer sobre a DriveX.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card border border-border rounded-2xl p-8 relative"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={`star-${testimonial.name}-${i}`}
                    className="w-5 h-5 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                {'"'}{testimonial.content}{'"'}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
