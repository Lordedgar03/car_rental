import { NextResponse } from "next/server"
import { prisma } from "@/lib/server/prisma"
import { requireAdminApi } from "@/lib/server/auth"
import { z } from "zod"

const PatchSchema = z.object({
  status: z.string().min(1).max(40).optional(),
  notes: z.string().max(4000).optional().nullable(),

  customerName: z.string().max(120).optional(),
  customerPhone: z.string().max(40).optional(),
  customerEmail: z.string().max(160).optional().nullable(),

  pickupLocation: z.string().max(120).optional().nullable(),
  dropoffLocation: z.string().max(120).optional().nullable(),

  pickupDate: z.string().optional().nullable(), // ISO
  returnDate: z.string().optional().nullable(), // ISO

  message: z.string().max(4000).optional().nullable(),
  carId: z.string().optional().nullable(),
})

function isAuthResponse(x: any): x is Response {
  return x instanceof Response
}

type Ctx = { params: Promise<{ id: string }> } // ✅ Next 16: params é Promise

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireAdminApi()
  if (isAuthResponse(auth)) return auth

  const { id } = await ctx.params // ✅ unwrap
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 })

  const body = await req.json().catch(() => ({}))
  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data: any = { ...parsed.data }

  // converter datas ISO -> Date
  if (typeof data.pickupDate === "string") data.pickupDate = new Date(data.pickupDate)
  if (typeof data.returnDate === "string") data.returnDate = new Date(data.returnDate)

  try {
    const updated = await prisma.lead.update({
      where: { id },
      data,
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }
    console.error("PATCH /api/admin/leads/[id] error:", e)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireAdminApi()
  if (isAuthResponse(auth)) return auth

  const { id } = await ctx.params // ✅ unwrap
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 })

  try {
    await prisma.lead.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }
    console.error("DELETE /api/admin/leads/[id] error:", e)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
