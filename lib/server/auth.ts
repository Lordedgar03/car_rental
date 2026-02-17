import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/server/prisma"

const COOKIE_NAME = "admin_session"
const SESSION_DAYS = 7

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex")
}

function nowPlusDays(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

/**
 * Normaliza cookies()/headers() para suportar versões/runtimes onde retornam
 * diretamente o store OU uma Promise.
 */
async function getCookieStore(): Promise<any> {
  const c: any = cookies()
  return typeof c?.then === "function" ? await c : c
}

async function getHeaderStore(): Promise<any> {
  const h: any = headers()
  return typeof h?.then === "function" ? await h : h
}

export async function getClientIp(): Promise<string | undefined> {
  const h = await getHeaderStore()
  const xff = h.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return h.get("x-real-ip") ?? undefined
}

export async function createAdminSession(
  adminUserId: string
): Promise<{ token: string; expiresAt: Date }> {
  const token = crypto.randomBytes(32).toString("hex")
  const tokenHash = sha256(token)
  const expiresAt = nowPlusDays(SESSION_DAYS)

  await prisma.adminSession.create({
    data: { adminUserId, tokenHash, expiresAt },
  })

  return { token, expiresAt }
}

export function setAdminSessionCookie(res: NextResponse, token: string, expiresAt: Date) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  })
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  })
}

export async function deleteCurrentAdminSession(): Promise<void> {
  const cookieStore = await getCookieStore()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return
  const tokenHash = sha256(token)
  await prisma.adminSession.deleteMany({ where: { tokenHash } })
}

export async function getAdminFromCookies() {
  const cookieStore = await getCookieStore()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  const tokenHash = sha256(token)
  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { adminUser: true },
  })

  if (!session) return null

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.adminSession.deleteMany({ where: { tokenHash } })
    return null
  }

  if (!session.adminUser.isActive) return null
  return session.adminUser
}

export async function requireAdmin() {
  const admin = await getAdminFromCookies()
  return admin ?? null
}

export async function requireAdminApi() {
  const admin = await getAdminFromCookies()
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  return admin
}
