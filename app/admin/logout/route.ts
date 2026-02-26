import { NextResponse } from "next/server"
import { clearAdminSessionCookie, deleteCurrentAdminSession } from "@/lib/server/auth"

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 })
}

export async function POST(req: Request) {
  await deleteCurrentAdminSession()
  const url = new URL("/admin/login", req.url)
  const res = NextResponse.redirect(url)
  clearAdminSessionCookie(res)
  return res
}
