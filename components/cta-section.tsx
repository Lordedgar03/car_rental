import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-br from-primary/20 via-card to-card border border-primary/30 rounded-3xl p-8 lg:p-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-balance">
                Pronto para Dirigir?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                Reserve agora e ganhe 10% de desconto na sua primeira locação. 
                Oferta válida por tempo limitado!
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8"
              >
                Reservar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary text-base px-8 bg-transparent"
              >
                <Phone className="mr-2 w-5 h-5" />
                Ligar Agora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
