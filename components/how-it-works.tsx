import { Search, Calendar, Car, ThumbsUp, ArrowRight } from "lucide-react";

const CTA_BG = "https://mgx-backend-cdn.metadl.com/generate/images/355658/2026-02-16/9a3dc487-36a3-4a99-bcc0-71b58d3eb1b5.png";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Escolha o Veículo",
    description: "Navegue pelo catálogo e encontre o carro perfeito para a sua aventura na ilha.",
  },
  {
    icon: Calendar,
    step: "02",
    title: "Entre em Contato",
    description: "Envie uma mensagem pelo WhatsApp para verificar disponibilidade e preços.",
  },
  {
    icon: Car,
    step: "03",
    title: "Retire o Carro",
    description: "Apresente os documentos e retire o veículo no local combinado em São Tomé.",
  },
  {
    icon: ThumbsUp,
    step: "04",
    title: "Aproveite a Ilha",
    description: "Explore praias, florestas e vilas com total tranquilidade e suporte.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={CTA_BG}
          alt="Estrada costeira de São Tomé"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--verde-stp)]/5 via-transparent to-[var(--verde-stp)]/5" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--verde-stp)]/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <span className="w-2 h-2 bg-[var(--verde-stp)] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[var(--verde-stp)] uppercase tracking-wider">
              Processo Simples
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Como <span className="gradient-text">Funciona</span>
          </h2>
          <p className="text-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Alugar um carro em São Tomé e Príncipe nunca foi tão fácil.
            Siga estes passos simples e comece a sua jornada.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 bg-gradient-to-r from-border via-[var(--verde-stp)]/30 to-border" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((item, index) => (
              <div key={item.step} className="relative group">
                <div className="relative bg-card border border-border/50 rounded-2xl p-8 h-full card-hover group-hover:border-[var(--verde-stp)]/30">
                  {/* Step indicator */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-[var(--verde-stp)] to-[var(--amarelo-stp)] rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-[var(--verde-stp)]/30 z-10">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mt-4 mb-6 bg-[var(--verde-stp)]/10 rounded-2xl flex items-center justify-center group-hover:bg-[var(--verde-stp)]/20 transition-colors duration-300">
                    <item.icon className="w-8 h-8 text-[var(--verde-stp)]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-center text-foreground group-hover:text-[var(--verde-stp)] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-center leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>

                {/* Arrow connector - mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-[var(--verde-stp)]/50 rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}