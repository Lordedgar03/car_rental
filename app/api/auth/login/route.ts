import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/server/prisma"
import { createAdminSession, setAdminSessionCookie } from "@/lib/server/auth"

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: Request) {
  const json = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 })
  }

  const { email, password } = parsed.data
  const user = await prisma.adminUser.findUnique({ where: { email } })
  if (!user || !user.isActive) {
    return NextResponse.json({ error: "credenciais inválidas" }, { status: 401 })
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    return NextResponse.json({ error: "credenciais inválidas" }, { status: 401 })
  }

  const { token, expiresAt } = await createAdminSession(user.id)
  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

  const res = NextResponse.json({ ok: true })
  setAdminSessionCookie(res, token, expiresAt)
  return res
}
