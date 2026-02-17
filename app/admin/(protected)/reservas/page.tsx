"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Calendar,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Clock,
  X,
  ChevronDown,
  MessageCircle,
  Plus,
  Save,
  Car as CarIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Car, Lead, LeadStatus, LeadContactChannel } from "@/lib/types"

const statusLabels: Record<LeadStatus, string> = {
  pendente: "Pendente",
  confirmada: "Confirmada",
  em_andamento: "Em Andamento",
  concluida: "Concluída",
  cancelada: "Cancelada",
}

const statusColors: Record<LeadStatus, string> = {
  pendente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  confirmada: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  em_andamento: "bg-green-500/10 text-green-500 border-green-500/30",
  concluida: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  cancelada: "bg-red-500/10 text-red-500 border-red-500/30",
}

const statusSelectColors: Record<LeadStatus, string> = {
  pendente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 focus:ring-yellow-500/30",
  confirmada: "bg-blue-500/10 text-blue-400 border-blue-500/30 focus:ring-blue-500/30",
  em_andamento: "bg-green-500/10 text-green-400 border-green-500/30 focus:ring-green-500/30",
  concluida: "bg-gray-500/10 text-gray-300 border-gray-500/30 focus:ring-gray-500/30",
  cancelada: "bg-red-500/10 text-red-400 border-red-500/30 focus:ring-red-500/30",
}

const allStatuses: LeadStatus[] = ["pendente", "confirmada", "em_andamento", "concluida", "cancelada"]

function fmtDate(d?: string | null) {
  if (!d) return "—"
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return "—"
  return dt.toLocaleDateString("pt-BR")
}

function fmtDateShort(d?: string | null) {
  if (!d) return "—"
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return "—"
  return dt.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

function fmtDateTime(d?: string | null) {
  if (!d) return "—"
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return "—"
  return dt.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }) + ", " +
    dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

function daysBetween(a?: string | null, b?: string | null) {
  if (!a || !b) return null
  const da = new Date(a)
  const db = new Date(b)
  if (isNaN(da.getTime()) || isNaN(db.getTime())) return null
  const diff = Math.ceil((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : null
}

function fmtBRL(value?: number | null) {
  if (value == null) return null
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function buildWhatsappLink(phone: string, text?: string) {
  const digits = phone.replace(/[^\d]/g, "")
  if (!digits) return null
  const msg = text ? `?text=${encodeURIComponent(text)}` : ""
  return `https://wa.me/${digits}${msg}`
}

function leadCode(lead: Lead) {
  // parecido com "res-002" da imagem (sem precisares de coluna no DB)
  const tail = (lead.id || "").slice(-3).toLowerCase()
  return `res-${tail || "000"}`
}

type LeadCreateForm = {
  customerName: string
  customerEmail: string
  customerPhone: string
  contactChannel: LeadContactChannel
  carId: string
  pickupDate: string
  returnDate: string
  pickupLocation: string
  dropoffLocation: string
  message: string
  notes: string
}

const emptyForm: LeadCreateForm = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  contactChannel: "whatsapp",
  carId: "",
  pickupDate: "",
  returnDate: "",
  pickupLocation: "",
  dropoffLocation: "",
  message: "",
  notes: "",
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [cars, setCars] = useState<Car[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all")
  const [selected, setSelected] = useState<Lead | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState<LeadCreateForm>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  const loadAll = async () => {
    const [carsRes, leadsRes] = await Promise.all([
      fetch("/api/admin/cars", { cache: "no-store" }).catch(() => null),
      fetch("/api/admin/leads", { cache: "no-store" }).catch(() => null),
    ])
    const carsJson = await carsRes?.json().catch(() => null)
    const leadsJson = await leadsRes?.json().catch(() => null)

    const carsList: Car[] = Array.isArray(carsJson?.cars) ? carsJson.cars : Array.isArray(carsJson) ? carsJson : []
    const leadsList: Lead[] = Array.isArray(leadsJson?.leads) ? leadsJson.leads : Array.isArray(leadsJson) ? leadsJson : []

    setCars(carsList.filter((c) => c.isActive))
    setLeads(leadsList)
  }

  useEffect(() => {
    loadAll()
  }, [])

  const filteredLeads = useMemo(() => {
    return leads
      .filter((l) => {
        if (filterStatus !== "all" && l.status !== filterStatus) return false
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          const email = (l.customerEmail ?? "").toLowerCase()
          const phone = (l.customerPhone ?? "").toLowerCase()
          const carName = (l.car?.name ?? "").toLowerCase()
          return (
            l.customerName.toLowerCase().includes(q) ||
            email.includes(q) ||
            phone.includes(q) ||
            carName.includes(q)
          )
        }
        return true
      })
      .sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return db - da
      })
  }, [leads, filterStatus, searchQuery])

  const patchLead = async (id: string, data: Partial<Lead>) => {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null)

    const json = await res?.json().catch(() => null)

    // aceita ambas: { lead: ... } ou objeto direto retornado pelo route.ts
    const updated: Lead | null =
      (json && typeof json === "object" && "lead" in json ? (json.lead as Lead) : json) ?? null

    if (updated && updated.id) {
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
      if (selected?.id === id) setSelected(updated)
      return updated
    }
    return null
  }

  const updateStatus = async (id: string, newStatus: LeadStatus) => {
    await patchLead(id, { status: newStatus } as any)
  }

  const deleteLead = async (id: string) => {
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" }).catch(() => null)
    setLeads((prev) => prev.filter((l) => l.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const openCreate = () => {
    setForm(emptyForm)
    setIsCreateOpen(true)
  }

  const closeCreate = () => {
    setIsCreateOpen(false)
    setIsSaving(false)
  }

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerName.trim()) return

    setIsSaving(true)
    const payload = {
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim() ? form.customerEmail.trim() : null,
      customerPhone: form.customerPhone.trim() ? form.customerPhone.trim() : null,
      contactChannel: form.contactChannel,
      carId: form.carId ? form.carId : null,
      pickupDate: form.pickupDate ? form.pickupDate : null,
      returnDate: form.returnDate ? form.returnDate : null,
      pickupLocation: form.pickupLocation.trim() ? form.pickupLocation.trim() : null,
      dropoffLocation: form.dropoffLocation.trim() ? form.dropoffLocation.trim() : null,
      message: form.message.trim() ? form.message.trim() : null,
      notes: form.notes.trim() ? form.notes.trim() : null,
    }

    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null)

    const json = await res?.json().catch(() => null)
    const created: Lead | null =
      (json && typeof json === "object" && "lead" in json ? (json.lead as Lead) : json) ?? null

    if (created && created.id) {
      setLeads((prev) => [created, ...prev])
      closeCreate()
    } else {
      setIsSaving(false)
    }
  }

  const selectedDays = selected ? daysBetween(selected.pickupDate, selected.returnDate) : null
  const selectedTotal =
    selected && selected.car?.pricePerDay && selectedDays ? selected.car.pricePerDay * selectedDays : null

  const whatsappHref =
    selected?.customerPhone
      ? buildWhatsappLink(selected.customerPhone, `Olá ${selected.customerName}!`)
      : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pedidos/Leads</h1>
          <p className="text-muted-foreground mt-1">Registrar pedidos e acompanhar status</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Registrar Pedido
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, e-mail, telefone ou veículo..."
              className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              onClick={() => setIsFilterOpen((v) => !v)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {filterStatus === "all" ? "Todos" : statusLabels[filterStatus]}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setFilterStatus("all")
                    setIsFilterOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-muted ${
                    filterStatus === "all" ? "bg-muted" : ""
                  }`}
                >
                  Todos
                </button>
                {allStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setFilterStatus(s)
                      setIsFilterOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-muted ${
                      filterStatus === s ? "bg-muted" : ""
                    }`}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      {filteredLeads.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mt-4">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery || filterStatus !== "all"
              ? "Tente ajustar os filtros."
              : "Registre o primeiro pedido manualmente."}
          </p>
          <Button onClick={openCreate} className="mt-6">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Pedido
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {filteredLeads.map((l) => (
              <div
                key={l.id}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelected(l)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground truncate">{l.customerName}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[l.status]}`}>
                        {statusLabels[l.status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CarIcon className="w-4 h-4" />
                        {l.car?.name || "Sem veículo"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {fmtDate(l.pickupDate)} - {fmtDate(l.returnDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {l.createdAt ? new Date(l.createdAt).toLocaleDateString("pt-BR") : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Sem "Próximo Status" — status é controlado no modal (igual à imagem) */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Modal — IGUAL À IMAGEM */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
  {/* Header */}
  <div className="flex items-start justify-between p-6 border-b border-border shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Detalhes da Reserva</h2>
                <p className="text-sm text-muted-foreground mt-1">{leadCode(selected)}</p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 hover:bg-muted/60 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
              {/* Status */}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="relative">
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value as LeadStatus)}
                    className={[
                      "w-full px-4 py-3 rounded-xl border outline-none appearance-none",
                      "focus:ring-2",
                      statusSelectColors[selected.status],
                    ].join(" ")}
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Car summary */}
              <div className="rounded-2xl bg-muted/30 border border-border p-5">
                <div className="text-lg font-semibold text-foreground">
                  {selected.car?.name || "Sem veículo"}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span>{selectedDays ? `${selectedDays} dias` : "—"}</span>
                  <span>•</span>
                  <span className="text-primary font-semibold">{selectedTotal ? fmtBRL(selectedTotal) : "—"}</span>
                </div>
              </div>

              {/* Cliente */}
              <div className="rounded-2xl bg-muted/20 border border-border p-5">
                <div className="text-lg font-semibold text-foreground mb-3">Cliente</div>

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="text-base font-semibold text-foreground">{selected.customerName}</div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{selected.customerPhone || "—"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{selected.customerEmail || "—"}</span>
                    </div>
                  </div>

                  {/* ícone WhatsApp à direita, como na imagem */}
                  <a
                    href={whatsappHref || "#"}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (!whatsappHref) e.preventDefault()
                    }}
                    className={[
                      "mt-1 rounded-full p-2 border transition-colors",
                      whatsappHref
                        ? "border-green-500/30 bg-green-500/10 hover:bg-green-500/15"
                        : "border-border opacity-40 cursor-not-allowed",
                    ].join(" ")}
                    aria-label="WhatsApp"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  </a>
                </div>

                {/* Datas (cartões) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div className="rounded-xl bg-background/40 border border-border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Retirada</span>
                    </div>
                    <div className="text-foreground font-semibold mt-2">{fmtDateShort(selected.pickupDate)}</div>
                  </div>

                  <div className="rounded-xl bg-background/40 border border-border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Devolução</span>
                    </div>
                    <div className="text-foreground font-semibold mt-2">{fmtDateShort(selected.returnDate)}</div>
                  </div>
                </div>

                {/* Local */}
                <div className="flex items-center gap-2 text-muted-foreground mt-4">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selected.pickupLocation || "—"}
                    {selected.dropoffLocation ? `  •  ${selected.dropoffLocation}` : ""}
                  </span>
                </div>

                {/* Criada em */}
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <Clock className="w-4 h-4" />
                  <span>Criada em {fmtDateTime(selected.createdAt)}</span>
                </div>
              </div>

              {/* Mensagem (opcional, mas discreta) */}
              {selected.message ? (
                <div className="rounded-2xl bg-muted/20 border border-border p-5">
                  <div className="text-sm text-muted-foreground mb-2">Mensagem</div>
                  <div className="text-foreground whitespace-pre-wrap">{selected.message}</div>
                </div>
              ) : null}
            </div>

            {/* Footer buttons — igual à imagem */}
           <div className="p-6 border-t border-border flex items-center gap-3 shrink-0">
              <a
                href={whatsappHref || "#"}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (!whatsappHref) e.preventDefault()
                }}
                className={[
                  "flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 border font-semibold transition-colors",
                  whatsappHref
                    ? "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/15"
                    : "border-border text-muted-foreground opacity-50 cursor-not-allowed",
                ].join(" ")}
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>

              <button
                onClick={() => deleteLead(selected.id)}
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 border border-red-500/30 bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/15 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal (mantém como estava) */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground">Registrar Pedido</h2>
                <p className="text-sm text-muted-foreground">Cadastro manual de pedidos/leads</p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeCreate}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={submitCreate} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nome *</label>
                  <input
                    value={form.customerName}
                    onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Veículo (opcional)</label>
                  <select
                    value={form.carId}
                    onChange={(e) => setForm((p) => ({ ...p, carId: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Sem veículo</option>
                    {cars.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <input
                    value={form.customerPhone}
                    onChange={(e) => setForm((p) => ({ ...p, customerPhone: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+239 9xxxxxxx"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => setForm((p) => ({ ...p, customerEmail: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="cliente@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Canal preferido</label>
                  <select
                    value={form.contactChannel}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, contactChannel: e.target.value as LeadContactChannel }))
                    }
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telefone">Telefone</option>
                    <option value="email">Email</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Data de retirada</label>
                  <input
                    type="date"
                    value={form.pickupDate}
                    onChange={(e) => setForm((p) => ({ ...p, pickupDate: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Data de devolução</label>
                  <input
                    type="date"
                    value={form.returnDate}
                    onChange={(e) => setForm((p) => ({ ...p, returnDate: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Local de retirada</label>
                  <input
                    value={form.pickupLocation}
                    onChange={(e) => setForm((p) => ({ ...p, pickupLocation: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: Aeroporto"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Local de devolução</label>
                  <input
                    value={form.dropoffLocation}
                    onChange={(e) => setForm((p) => ({ ...p, dropoffLocation: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: Hotel"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Mensagem (opcional)</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[90px]"
                  placeholder="Descrição do pedido..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Notas internas (opcional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[90px]"
                  placeholder="Observações internas..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Salvando..." : "Salvar Pedido"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={closeCreate} disabled={isSaving}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
