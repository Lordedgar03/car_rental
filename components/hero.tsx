"use client"
import { ArrowRight, MessageCircle, Star, Shield, Clock } from "lucide-react";

const HERO_BG = "/images/hero-stp.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt="Praia de São Tomé e Príncipe"
          className="w-full h-full object-cover object-center scale-105"
        />

        {/* Overlay sutil para melhorar leitura */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/50 to-transparent" />
      </div>
      {/* Floating decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[var(--verde-stp)]/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--amarelo-stp)]/5 rounded-full blur-3xl animate-float delay-300" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-2xl">
          {/* Personal Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full mb-8 animate-slide-up">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--verde-stp)] to-[var(--amarelo-stp)] flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Veículos D'ALmeida</p>
              <p className="text-xs text-muted-foreground">Locador de Veículos</p>
            </div>
            <div className="flex items-center gap-1 ml-2 pl-3 border-l border-border">
              <Star className="w-4 h-4 text-[var(--amarelo-stp)] fill-[var(--amarelo-stp)]" />
              <span className="text-sm font-medium">4.9</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-slide-up delay-100">
            Alugue o carro ideal em{" "}
            <span className="gradient-text">São Tomé e Príncipe</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg lg:text-xl text-foreground/90 mb-10 max-w-lg leading-relaxed animate-slide-up delay-200">
            Explore as praias paradisíacas, florestas tropicais e estradas costeiras
            com os nossos veículos bem cuidados, preços justos e atendimento personalizado.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-300">
            <a href="#veiculos" className="btn-stp text-base px-8 py-4 justify-center">
              Ver Carros Disponíveis
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/+2399034266"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-stp text-base px-8 py-4 justify-center">
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 mt-14 pt-8 border-t border-border/30 animate-slide-up delay-400">
            <div className="flex items-center gap-3 px-4 py-2 glass rounded-full">
              <Shield className="w-5 h-5 text-[var(--verde-stp)]" />
              <span className="text-sm text-foreground">Carros revisados</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 glass rounded-full">
              <Clock className="w-5 h-5 text-[var(--verde-stp)]" />
              <span className="text-sm text-foreground">Suporte 24h</span>
            </div>
          </div>
        </div>
      </div>


      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-3">
        {/* Texto dentro de uma pill com glass effect */}
        <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-lg">
          <span className="text-xs lg:text-sm font-medium text-white tracking-[0.25em] uppercase">
            Conheça os carros
          </span>
        </div>

        {/* “Mouse” com bolinha animada */}
        <div className="w-7 h-11 border-2 border-white/70 rounded-full flex justify-center pt-2 shadow-md bg-black/20 backdrop-blur">
          <div className="w-1.5 h-3 bg-[var(--verde-stp)] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
