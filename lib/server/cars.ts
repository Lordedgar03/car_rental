import { prisma } from "@/lib/server/prisma"
import { unstable_noStore as noStore } from "next/cache"

export async function getPublicCars() {
  // ✅ evita cache de render / data no App Router
  noStore()

  const cars = await prisma.car.findMany({
    where: {
      isActive: true,
      availabilityStatus: "available", // ✅ só disponíveis na home
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
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
    },
  })

  return cars
}

export async function getAdminCars() {
  const cars = await prisma.car.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    select: {
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
    },
  })
  return cars
}
