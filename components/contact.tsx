"use client"

import { useMemo, useState } from "react"
import type { Car } from "@/lib/types"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react"

const CONTACT_BG =
  "https://mgx-backend-cdn.metadl.com/generate/images/355658/2026-02-16/8e2b2f75-f918-4d00-9d4f-3a13608c6083.png"

const contactInfo = [
  { icon: MapPin, title: "Localização", content: "São Tomé, São Tomé e Príncipe" },
  { icon: Phone, title: "Telefone / WhatsApp", content: "+239 999 9999" },
  { icon: Mail, title: "E-mail", content: "ricardo@rcveiculos.st" },
  { icon: Clock, title: "Atendimento", content: "Todos os dias: 7h às 22h" },
]

type Props = { cars: Car[] }

export function Contact({ cars }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    carId: "",
    pickupDate: "",
    returnDate: "",
    message: "",
  })

  const activeCars = useMemo(() => {
    return (cars ?? [])
      .filter((c) => c.isActive && c.availabilityStatus === "available")
      .sort((a, b) => a.name.localeCompare(b.name, "pt"))
  }, [cars])

  const selectedCar = useMemo(() => {
    if (!formData.carId) return null
    return activeCars.find((c) => c.id === formData.carId) ?? null
  }, [formData.carId, activeCars])

  const whatsappLink = useMemo(() => {
    const carText = selectedCar ? `${selectedCar.name} (${selectedCar.year})` : ""
    const parts = [
      `Olá! Vim pelo site RC Veículos.`,
      carText ? `Interesse: ${carText}` : null,
      formData.pickupDate ? `Retirada: ${formData.pickupDate}` : null,
      formData.returnDate ? `Devolução: ${formData.returnDate}` : null,
      formData.name ? `Nome: ${formData.name}` : null,
      formData.phone ? `Telefone: ${formData.phone}` : null,
      formData.email ? `E-mail: ${formData.email}` : null,
      formData.message ? `Mensagem: ${formData.message}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    return `https://wa.me/2399999999?text=${encodeURIComponent(parts)}`
  }, [formData, selectedCar])

  const mailLink = useMemo(() => {
    const carText = selectedCar ? `${selectedCar.name} (${selectedCar.year})` : ""
    const subject = carText ? `Pedido de reserva: ${carText}` : "Pedido de informações"

    const body = [
      `Olá! Vim pelo site RC Veículos.`,
      carText ? `Interesse: ${carText}` : null,
      formData.pickupDate ? `Retirada: ${formData.pickupDate}` : null,
      formData.returnDate ? `Devolução: ${formData.returnDate}` : null,
      formData.name ? `Nome: ${formData.name}` : null,
      formData.phone ? `Telefone: ${formData.phone}` : null,
      formData.email ? `E-mail: ${formData.email}` : null,
      formData.message ? `Mensagem: ${formData.message}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    return `mailto:ricardo@rcveiculos.st?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [formData, selectedCar])

  const inputClass =
    "w-full px-4 py-3.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--verde-stp)] focus:border-transparent transition-all duration-300"

  return (
    <section id="contato" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src={CONTACT_BG} alt="Cidade de São Tomé" className="w-full h-full object-cover" 
        style={{ filter: 'brightness(1.2) saturate(1.3)' }}
        />
        <div className="absolute inset-0 bg-background/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--verde-stp)]/3 to-[var(--amarelo-stp)]/3" />
      </div>

      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[var(--verde-stp)]/5 to-transparent rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <MessageCircle className="w-4 h-4 text-[var(--verde-stp)]" />
            <span className="text-sm font-medium text-[var(--verde-stp)] uppercase tracking-wider">Contato</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Fale connosco para <span className="gradient-text">Reservar</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Para reservar, será direcionado para WhatsApp ou e-mail. Atendimento rápido e personalizado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-4">
            {contactInfo.map((item, index) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-5 glass rounded-2xl card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-[var(--verde-stp)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-[var(--verde-stp)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.content}</p>
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <div className="relative p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-foreground">Atendimento rápido</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  Se preferir, chame direto no WhatsApp e confirmamos a disponibilidade.
                </p>
                <a
                  href="https://wa.me/2399999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chamar no WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="glass rounded-3xl p-8 lg:p-10">
            <h3 className="text-2xl font-bold mb-2 text-foreground">Pedido de reserva</h3>
            <p className="text-sm text-muted-foreground mb-8">
              Preencha as preferências e escolha como enviar (WhatsApp ou e-mail).
            </p>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nome</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <input
                    type="tel"
                    placeholder="+239 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Carro de interesse</label>
                <select
                  value={formData.carId}
                  onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Selecione um carro (opcional)</option>
                  {activeCars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.year} — Db {Number(c.pricePerDay ?? 0).toLocaleString("pt-BR")}/dia
                    </option>
                  ))}
                </select>

                {activeCars.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    (Nenhum carro disponível agora — verifique no painel Admin se os veículos estão como “available”.)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Retirada (preferência)</label>
                  <input
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Devolução (preferência)</label>
                  <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mensagem</label>
                <textarea
                  rows={3}
                  placeholder="Ex.: preciso de entrega no aeroporto, dúvidas, etc."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-stp flex-1 justify-center py-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar no WhatsApp
                </a>

                <a
                  href={mailLink}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-border/50 hover:border-[var(--verde-stp)]/50 text-foreground font-medium rounded-xl transition-all duration-300 bg-transparent"
                >
                  <Send className="w-5 h-5" />
                  Enviar por e-mail
                </a>
              </div>

              <p className="text-xs text-muted-foreground">
                Ao clicar, o seu app abrirá com a mensagem pré-preenchida. Pode editar antes de enviar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
