import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/server/prisma"
import { requireAdminApi } from "@/lib/server/auth"

const CarCreateSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  imageUrl: z.string().min(1).optional().default("/placeholder.svg"),
  passengers: z.coerce.number().int().min(1),
  transmission: z.string().min(1),
  fuel: z.string().min(1),
  pricePerDay: z.coerce.number().int().min(0),
  featured: z.coerce.boolean().optional().default(false),
  availabilityStatus: z.enum(["available", "unavailable", "maintenance"]).optional().default("available"),
  year: z.coerce.number().int().min(1950).max(2100),
  description: z.string().optional().nullable(),
  isActive: z.coerce.boolean().optional().default(true),
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

export async function GET() {
  const adminOrRes = await requireAdminApi()
  if (adminOrRes instanceof NextResponse) return adminOrRes

  const cars = await prisma.car.findMany({ orderBy: [{ isActive: "desc" }, { createdAt: "desc" }], select: Select })
  return NextResponse.json({ cars })
}

export async function POST(req: Request) {
  const adminOrRes = await requireAdminApi()
  if (adminOrRes instanceof NextResponse) return adminOrRes

  const json = await req.json().catch(() => null)
  const parsed = CarCreateSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "payload inválido", details: parsed.error.flatten() }, { status: 400 })
  }

  const car = await prisma.car.create({ data: parsed.data, select: Select })
  return NextResponse.json({ car }, { status: 201 })
}
