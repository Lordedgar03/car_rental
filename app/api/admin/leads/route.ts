import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/server/prisma"
import { requireAdminApi } from "@/lib/server/auth"

function parseDate(input: unknown): Date | null {
  if (input == null) return null
  if (typeof input !== "string") return null
  const trimmed = input.trim()
  if (!trimmed) return null
  const d = new Date(trimmed)
  if (isNaN(d.getTime())) return null
  return d
}

const LeadCreateSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  contactChannel: z.enum(["whatsapp", "email", "telefone", "outro"]).optional(),
  status: z.enum(["pendente", "confirmada", "em_andamento", "concluida", "cancelada"]).optional(),
  pickupDate: z.string().optional().nullable(),
  returnDate: z.string().optional().nullable(),
  pickupLocation: z.string().optional().nullable(),
  dropoffLocation: z.string().optional().nullable(),
  carId: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

const Select = {
  id: true,
  status: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  contactChannel: true,
  pickupDate: true,
  returnDate: true,
  pickupLocation: true,
  dropoffLocation: true,
  message: true,
  notes: true,
  carId: true,
  createdAt: true,
  updatedAt: true,
} as const

export async function GET() {
  const adminOrRes = await requireAdminApi()
  if (adminOrRes instanceof NextResponse) return adminOrRes

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      ...Select,
      car: { select: { id: true, name: true, imageUrl: true, pricePerDay: true } },
    },
  })

  return NextResponse.json({ leads })
}

export async function POST(req: Request) {
  const adminOrRes = await requireAdminApi()
  if (adminOrRes instanceof NextResponse) return adminOrRes

  const json = await req.json().catch(() => null)
  const parsed = LeadCreateSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "payload inválido", details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const lead = await prisma.lead.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail ?? null,
      customerPhone: data.customerPhone ?? null,
      contactChannel: data.contactChannel ?? "whatsapp",
      status: data.status ?? "pendente",
      pickupDate: parseDate(data.pickupDate),
      returnDate: parseDate(data.returnDate),
      pickupLocation: data.pickupLocation ?? null,
      dropoffLocation: data.dropoffLocation ?? null,
      carId: data.carId ?? null,
      message: data.message ?? null,
      notes: data.notes ?? null,
    },
    select: {
      ...Select,
      car: { select: { id: true, name: true, imageUrl: true, pricePerDay: true } },
    },
  })

  return NextResponse.json({ lead }, { status: 201 })
}
