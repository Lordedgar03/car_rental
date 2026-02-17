import { NextResponse } from "next/server"
import { clearAdminSessionCookie, deleteCurrentAdminSession } from "@/lib/server/auth"

export async function POST() {
  await deleteCurrentAdminSession()
  const res = NextResponse.json({ ok: true })
  clearAdminSessionCookie(res)
  return res
}
