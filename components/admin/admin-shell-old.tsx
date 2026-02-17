"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Car, LayoutDashboard, CalendarDays, Home, LogOut, Menu, X } from "lucide-react"

type Props = {
  children: React.ReactNode
  brand: string
  subtitle: string
  adminName?: string
}

export function AdminShellOld({ children, brand, subtitle, adminName }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const nav = useMemo(
    () => [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/carros", label: "Carros", icon: Car },
      { href: "/admin/reservas", label: "Reservas", icon: CalendarDays },
    ],
    []
  )

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {}
    router.push("/admin/login")
    router.refresh()
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname?.startsWith(href + "/"))

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#0B0F14]/90 backdrop-blur border-b border-white/10">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
            aria-label="menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Car className="w-5 h-5 text-orange-400" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold">{brand}</div>
              <div className="text-xs text-white/60">{subtitle}</div>
            </div>
          </div>

          <div className="w-10" />
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={[
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-72",
          "bg-[#0B0F14] border-r border-white/10",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <Car className="w-6 h-6 text-orange-400" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-lg">{brand}</div>
              <div className="text-sm text-white/60">{subtitle}</div>
              {adminName ? <div className="text-xs text-white/40 mt-1">{adminName}</div> : null}
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {nav.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition",
                    active
                      ? "bg-orange-500 text-black"
                      : "text-white/70 hover:text-white hover:bg-white/5",
                  ].join(" ")}
                >
                  <Icon className={["w-5 h-5", active ? "text-black" : "text-white/60"].join(" ")} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 space-y-3">
            <Button
              variant="outline"
              className="w-full bg-transparent border-white/15 text-white hover:bg-white/5 justify-start"
              asChild
            >
              <Link href="/" onClick={() => setOpen(false)}>
                <Home className="w-4 h-4 mr-2" />
                Ver Site
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Main */}
      <main className="lg:ml-72 min-h-screen px-6 lg:px-10 py-8">{children}</main>
    </div>
  )
}
