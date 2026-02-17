"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Car, Calendar, DollarSign, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Car as CarType, Lead } from "@/lib/types"

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  confirmada: "Confirmada",
  em_andamento: "Em Andamento",
  concluida: "Concluída",
  cancelada: "Cancelada",
}

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-500/10 text-yellow-500",
  confirmada: "bg-blue-500/10 text-blue-500",
  em_andamento: "bg-green-500/10 text-green-500",
  concluida: "bg-gray-500/10 text-gray-400",
  cancelada: "bg-red-500/10 text-red-500",
}

function daysBetween(start?: string | null, end?: string | null): number | null {
  if (!start || !end) return null
  const s = new Date(start)
  const e = new Date(end)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return null
  const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : null
}

export default function AdminDashboard() {
  const [cars, setCars] = useState<CarType[]>([])
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    ;(async () => {
      const [carsRes, leadsRes] = await Promise.all([
        fetch("/api/admin/cars", { cache: "no-store" }).catch(() => null),
        fetch("/api/admin/leads", { cache: "no-store" }).catch(() => null),
      ])

      const carsJson = await carsRes?.json().catch(() => null)
      const leadsJson = await leadsRes?.json().catch(() => null)

      const carsList = Array.isArray(carsJson?.cars) ? carsJson.cars : []
      const leadsList = Array.isArray(leadsJson?.leads) ? leadsJson.leads : []

      // Admin list: mostra apenas ativos
      setCars(carsList.filter((c: CarType) => c.isActive))
      setLeads(leadsList)
    })()
  }, [])

  const availableCars = useMemo(
    () => cars.filter((c) => c.availabilityStatus === "available").length,
    [cars]
  )

  const openLeads = useMemo(
    () => leads.filter((l) => l.status === "pendente" || l.status === "confirmada" || l.status === "em_andamento").length,
    [leads]
  )

  const pendingLeads = useMemo(() => leads.filter((l) => l.status === "pendente").length, [leads])

  const estimatedRevenue = useMemo(() => {
    return leads
      .filter((l) => l.status !== "cancelada" && l.status !== "concluida")
      .reduce((acc, l) => {
        const d = daysBetween(l.pickupDate, l.returnDate)
        if (!d || !l.car) return acc
        return acc + d * (l.car.pricePerDay || 0)
      }, 0)
  }, [leads])

  const recentLeads = useMemo(() => {
    const list = [...leads]
    list.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return db - da
    })
    return list.slice(0, 5)
  }, [leads])

  const stats = [
    {
      label: "Carros Disponíveis",
      value: availableCars,
      total: cars.length,
      icon: Car,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Pedidos em Aberto",
      value: openLeads,
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Aguardando Confirmação",
      value: pendingLeads,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Receita Estimada",
      value: `STN ${estimatedRevenue.toLocaleString("pt-BR")}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do seu negócio de locação</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.total != null && (
                <span className="text-xs text-muted-foreground">de {stat.total}</span>
              )}
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Pedidos/Leads Recentes</h2>
            <p className="text-sm text-muted-foreground">Últimas solicitações registradas</p>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href="/admin/reservas">
              Ver Todos
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Nenhum pedido ainda</div>
        ) : (
          <div className="divide-y divide-border">
            {recentLeads.map((lead) => {
              const totalDays = daysBetween(lead.pickupDate, lead.returnDate)
              const est = totalDays && lead.car ? totalDays * lead.car.pricePerDay : null
              return (
                <div key={lead.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground truncate">{lead.customerName}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>
                        {statusLabels[lead.status]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {lead.car?.name ? lead.car.name : "Sem veículo"}{totalDays ? ` - ${totalDays} dias` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        {est != null ? `STN ${est.toLocaleString("pt-BR")}` : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lead.pickupDate ? new Date(lead.pickupDate).toLocaleDateString("pt-BR") : "—"}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin/reservas">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/carros"
          className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Gerenciar Veículos</h3>
              <p className="text-sm text-muted-foreground">Adicionar, editar ou remover veículos</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/reservas"
          className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Gerenciar Pedidos/Leads</h3>
              <p className="text-sm text-muted-foreground">Registrar pedidos e atualizar status</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
