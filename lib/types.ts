export type CarCategory = "SUV" | "Sedan" | "Esportivo" | "Pickup" | "Compacto" | string
export type Transmission = "Automático" | "Manual" | string
export type Fuel = "Gasolina" | "Diesel" | "Híbrido" | "Elétrico" | "Flex" | string

export type AvailabilityStatus = "available" | "unavailable" | "maintenance"

export interface Car {
  id: string
  name: string
  category: CarCategory
  imageUrl: string
  passengers: number
  transmission: Transmission
  fuel: Fuel
  pricePerDay: number
  featured: boolean
  availabilityStatus: AvailabilityStatus
  year: number
  description?: string | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export type LeadStatus = "pendente" | "confirmada" | "em_andamento" | "concluida" | "cancelada"
export type LeadContactChannel = "whatsapp" | "email" | "telefone" | "outro"

export interface Lead {
  id: string
  status: LeadStatus
  customerName: string
  customerEmail?: string | null
  customerPhone?: string | null
  contactChannel: LeadContactChannel

  pickupDate?: string | null
  returnDate?: string | null
  pickupLocation?: string | null
  dropoffLocation?: string | null

  message?: string | null
  notes?: string | null

  carId?: string | null
  car?: {
    id: string
    name: string
    imageUrl: string
    pricePerDay: number
  } | null

  createdAt?: string
  updatedAt?: string
}
