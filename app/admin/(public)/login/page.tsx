"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const nextUrl = useMemo(() => {
    const n = searchParams?.get("next")
    // evita open-redirect: só aceita caminhos internos
    if (!n) return "/admin"
    if (n.startsWith("/") && !n.startsWith("//")) return n
    return "/admin"
  }, [searchParams])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
        // importante para garantir cookie de sessão também em produção
        credentials: "include",
        cache: "no-store",
      })

      const data = await res.json().catch(() => ({} as any))

      if (!res.ok) {
        setError(data?.error ?? "Falha no login")
        return
      }

      // navegação "hard" garante que o SSR revalida cookie/sessão imediatamente
      window.location.assign(nextUrl)

      // alternativa (client navigation). Mantém comentado:
      // router.replace(nextUrl)
      // router.refresh()
    } catch {
      setError("Erro de rede. Verifica tua ligação e tenta novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl p-8 border border-border bg-card shadow-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 17a2 2 0 0 0 2-2v-2a2 2 0 0 0-4 0v2a2 2 0 0 0 2 2Z" />
              <path d="M16 11V8a4 4 0 0 0-8 0v3" />
              <path d="M6 11h12v10H6z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold">Painel Admin</h1>
          <p className="text-muted-foreground mt-1">Entre para gerenciar os veículos</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@exemplo.com"
              className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <div
              className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Dica: se estiveres a ser redirecionado após reload, confirma cookie <code>admin_session</code> e
            se o layout protegido está com <code>dynamic = &quot;force-dynamic&quot;</code>.
          </p>
        </form>
      </div>
    </div>
  )
}
