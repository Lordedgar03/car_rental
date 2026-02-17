import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/server/prisma"
import { requireAdminApi } from "@/lib/server/auth"
import { Prisma } from "@prisma/client"

const CarUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),
  passengers: z.coerce.number().int().min(1).optional(),
  transmission: z.string().min(1).optional(),
  fuel: z.string().min(1).optional(),
  pricePerDay: z.coerce.number().int().min(0).optional(),
  featured: z.coerce.boolean().optional(),
  availabilityStatus: z.enum(["available", "unavailable", "maintenance"]).optional(),
  year: z.coerce.number().int().min(1950).max(2100).optional(),
  description: z.string().optional().nullable(),
  isActive: z.coerce.boolean().optional(),
})

const Select = {
  id: true,
  name: true,
  category: true,
  imageUrl: true,
  passengers: true,
  transmission: true,
  fuel: true,
  pricePerDay: true,
  featured: true,
  availabilityStatus: true,
  year: true,
  description: true,
  isActive: true,
} as const

async function getIdFromCtx(ctx: { params: any }) {
  // Next 16/Turbopack: ctx.params pode ser Promise
  const params = await Promise.resolve(ctx.params)
  const id = params?.id
  if (!id || typeof id !== "string") return null
  return id
}

export async function PATCH(req: Request, ctx: { params: any }) {
  const adminOrRes = await requireAdminApi()
  if (adminOrRes instanceof NextResponse) return adminOrRes

  const id = await getIdFromCtx(ctx)
  if (!id) return NextResponse.json({ error: "id inválido" }, { status: 400 })

  const json = await req.json().catch(() => null)
  const parsed = CarUpdateSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "payload inválido", details: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const car = await prisma.car.update({
      where: { id },
      data: parsed.data,
      select: Select,
    })
    return NextResponse.json({ car })
  } catch (err) {
    // P2025 = record not found
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "veículo não encontrado" }, { status: 404 })
    }
    console.error("PATCH /api/admin/cars/[id] error:", err)
    return NextResponse.json({ error: "erro interno" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, ctx: { params: any }) {
  const adminOrRes = await requireAdminApi()
  if (adminOrRes instanceof NextResponse) return adminOrRes

  const id = await getIdFromCtx(ctx)
  if (!id) return NextResponse.json({ error: "id inválido" }, { status: 400 })

  try {
    const car = await prisma.car.update({
      where: { id },
      data: { isActive: false },
      select: Select,
    })
    return NextResponse.json({ car })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "veículo não encontrado" }, { status: 404 })
    }
    console.error("DELETE /api/admin/cars/[id] error:", err)
    return NextResponse.json({ error: "erro interno" }, { status: 500 })
  }
}
