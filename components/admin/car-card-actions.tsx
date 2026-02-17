"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

type Props = {
  id: string
  isActive: boolean
  availabilityStatus: "available" | "unavailable" | "maintenance"
}

export function CarCardActions({ id, isActive, availabilityStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggleActive() {
    setLoading(true)
    try {
      await fetch(`/api/admin/cars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function remove() {
    if (!confirm("Remover/arquivar este veículo?")) return
    setLoading(true)
    try {
      await fetch(`/api/admin/cars/${id}`, { method: "DELETE" })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-2 grid grid-cols-3 gap-3">
      <Link
        href={`/admin/carros/${id}/editar`}
        className="col-span-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
      >
        <Pencil className="w-4 h-4" />
        Editar
      </Link>

      <button
        disabled={loading}
        onClick={toggleActive}
        className={[
          "col-span-1 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10",
          !isActive ? "text-white/50" : "",
        ].join(" ")}
        title={`Estado atual: ${availabilityStatus}`}
      >
        {isActive ? "Desativar" : "Ativar"}
      </button>

      <button
        disabled={loading}
        onClick={remove}
        className="col-span-1 h-10 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/15 text-red-300 inline-flex items-center justify-center"
        aria-label="remover"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
