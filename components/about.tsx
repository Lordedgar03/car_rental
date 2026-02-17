import { Shield, Clock, Wrench, Heart, CheckCircle, Quote } from "lucide-react";

const ABOUT_BG = "https://mgx-backend-cdn.metadl.com/generate/images/355658/2026-02-16/54290a62-1bfc-4c74-ac8b-425cbcb9ab56.png";

const features = [
  {
    icon: Shield,
    title: "Segurança Garantida",
    description: "Todos os carros possuem seguro e documentação em dia.",
  },
  {
    icon: Clock,
    title: "Resposta Rápida",
    description: "Respondemos todas as mensagens em menos de 1 hora.",
  },
  {
    icon: Wrench,
    title: "Carros Revisados",
    description: "Manutenção preventiva antes de cada locação.",
  },
  {
    icon: Heart,
    title: "Preço Justo",
    description: "Valores transparentes, sem taxas escondidas.",
  },
];

const highlights = [
  "Frota própria e bem cuidada",
  "Flexibilidade na negociação",
];

export function About() {
  return (
    <section id="sobre" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={ABOUT_BG}
          alt="Paisagem de São Tomé e Príncipe"
          className="w-full h-full object-cover"
            style={{ filter: 'brightness(1.2) saturate(1.3)' }}
        />
        <div className="absolute inset-0 bg-background/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--verde-stp)]/3 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
              <span className="text-sm font-medium text-[var(--verde-stp)] uppercase tracking-wider">
                Sobre Nós
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Locação de veículos com{" "}
              <span className="gradient-text">atendimento pessoal</span>
            </h2>

            <div className="space-y-5 text-foreground leading-relaxed mb-8">
              <p className="text-lg">
                Locação de veículos em São Tomé e Príncipe .
                Com uma frota de carros
                para atender diferentes necessidades.
              </p>
              <p>
                O meu diferencial é o atendimento direto e personalizado. Fala diretamente
                comigo, sem intermediários. Isso permite preços mais justos e flexibilidade
                para negociar.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--verde-stp)] flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="relative p-6 glass rounded-2xl">
              <Quote className="absolute -top-3 -left-2 w-8 h-8 text-[var(--verde-stp)]/30" />
              <p className="text-foreground italic pl-4">
                "A sua satisfação é a minha prioridade. Cada carro é preparado com carinho
                para que tenha a melhor experiência possível em São Tomé e Príncipe."
              </p>
              <div className="flex items-center gap-3 mt-4 pl-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--verde-stp)] to-[var(--amarelo-stp)] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground"></p>
                  <p className="text-xs text-muted-foreground">Proprietário</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 bg-card border border-border/50 rounded-2xl card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-[var(--verde-stp)]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[var(--verde-stp)]/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-[var(--verde-stp)]" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-[var(--verde-stp)] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}