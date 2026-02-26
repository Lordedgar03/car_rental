import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/server/auth"
import { AdminShell } from "@/components/admin/admin-shell"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin()
  if (!admin) redirect("/admin/login")
  return <AdminShell>{children}</AdminShell>
}
