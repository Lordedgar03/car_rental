/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

function env(name, fallback) {
  const v = process.env[name]
  return v && v.trim() ? v.trim() : fallback
}

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d
}

async function main() {
  const adminEmail = env("ADMIN_EMAIL", "admin@example.com")
  const adminPassword = env("ADMIN_PASSWORD", "admin123")
  const adminName = env("ADMIN_NAME", "Admin")

  // Create default admin if missing
  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } })
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    await prisma.adminUser.create({
      data: {
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "owner",
        isActive: true,
      },
    })
    console.log(`✅ Admin criado: ${adminEmail}`)
  } else {
    console.log(`ℹ️ Admin já existe: ${adminEmail}`)
  }

  // Seed basic settings if missing
  const settings = [
    ["site_name", env("NEXT_PUBLIC_SITE_NAME", "RC Veículos")],
    ["contact_whatsapp_e164", env("NEXT_PUBLIC_CONTACT_WHATSAPP_E164", "+2399000000")],
    ["contact_email", env("NEXT_PUBLIC_CONTACT_EMAIL", "contato@example.com")],
    ["contact_phone_display", env("NEXT_PUBLIC_CONTACT_PHONE_DISPLAY", "+239 900 0000")],
    ["contact_city", env("NEXT_PUBLIC_CONTACT_CITY", "São Tomé")],
  ]

  for (const [key, value] of settings) {
    const found = await prisma.setting.findUnique({ where: { key } })
    if (!found) {
      await prisma.setting.create({ data: { key, value } })
    }
  }

  // Seed cars only if none exist
  const carCount = await prisma.car.count()
  if (carCount === 0) {
    await prisma.car.createMany({
      data: [
        {
          name: "Range Rover Sport",
          category: "SUV",
          imageUrl: "/images/car-suv.jpg",
          passengers: 5,
          transmission: "Automático",
          fuel: "Gasolina",
          pricePerDay: 450,
          featured: true,
          availabilityStatus: "available",
          year: 2024,
          description: "SUV de luxo com conforto incomparável e desempenho superior.",
          isActive: true,
        },
        {
          name: "Mercedes-Benz Classe E",
          category: "Sedan",
          imageUrl: "/images/car-sedan.jpg",
          passengers: 5,
          transmission: "Automático",
          fuel: "Híbrido",
          pricePerDay: 380,
          featured: false,
          availabilityStatus: "available",
          year: 2024,
          description: "Sedan executivo com tecnologia de ponta e elegância atemporal.",
          isActive: true,
        },
        {
          name: "Porsche 911 Carrera",
          category: "Esportivo",
          imageUrl: "/images/car-sports.jpg",
          passengers: 2,
          transmission: "Automático",
          fuel: "Gasolina",
          pricePerDay: 750,
          featured: true,
          availabilityStatus: "available",
          year: 2024,
          description: "O icônico esportivo alemão com performance de tirar o fôlego.",
          isActive: true,
        },
        {
          name: "Ford Ranger Raptor",
          category: "Pickup",
          imageUrl: "/images/car-pickup.jpg",
          passengers: 5,
          transmission: "Automático",
          fuel: "Diesel",
          pricePerDay: 320,
          featured: false,
          availabilityStatus: "available",
          year: 2024,
          description: "Pickup robusta para qualquer terreno com potência e estilo.",
          isActive: true,
        },
        {
          name: "Volkswagen Golf GTI",
          category: "Compacto",
          imageUrl: "/images/car-compact.jpg",
          passengers: 5,
          transmission: "Manual",
          fuel: "Gasolina",
          pricePerDay: 250,
          featured: false,
          availabilityStatus: "available",
          year: 2024,
          description: "Compacto esportivo com muita diversão ao volante.",
          isActive: true,
        },
      ],
    })
    console.log("✅ Carros de exemplo inseridos")
  } else {
    console.log(`ℹ️ Já existem ${carCount} carros, seed ignorado`)
  }

  // Seed leads/pedidos only if none exist
  const leadCount = await prisma.lead.count().catch(() => 0)
  if (leadCount === 0) {
    const cars = await prisma.car.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" }, take: 2 })

    await prisma.lead.createMany({
      data: [
        {
          customerName: "João Silva",
          customerPhone: "+239 9xx xxx xxx",
          customerEmail: "joao@example.com",
          contactChannel: "whatsapp",
          status: "pendente",
          pickupDate: daysFromNow(2),
          returnDate: daysFromNow(5),
          pickupLocation: "Centro",
          dropoffLocation: "Aeroporto",
          carId: cars[0]?.id ?? null,
          message: "Quero confirmar disponibilidade e preço para esses dias.",
          notes: "Cliente pediu resposta rápida.",
        },
        {
          customerName: "Maria Costa",
          customerPhone: "+239 9yy yyy yyy",
          customerEmail: "maria@example.com",
          contactChannel: "email",
          status: "confirmada",
          pickupDate: daysFromNow(7),
          returnDate: daysFromNow(10),
          pickupLocation: "Hotel",
          dropoffLocation: "Hotel",
          carId: cars[1]?.id ?? null,
          message: "Gostaria de reservar, pode enviar detalhes por email.",
          notes: null,
        },
      ],
    })
    console.log("✅ Pedidos/Leads de exemplo inseridos")
  } else {
    console.log(`ℹ️ Já existem ${leadCount} leads, seed ignorado`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
