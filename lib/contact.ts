export function normalizeWhatsapp(phoneE164: string): string {
  return phoneE164.replace(/[^\d]/g, "")
}

export function buildWhatsAppLink(phoneE164: string, message: string): string {
  const digits = normalizeWhatsapp(phoneE164)
  const text = encodeURIComponent(message)
  return `https://wa.me/${digits}?text=${text}`
}

export function buildMailtoLink(email: string, subject: string, body: string): string {
  const s = encodeURIComponent(subject)
  const b = encodeURIComponent(body)
  return `mailto:${email}?subject=${s}&body=${b}`
}

export function buildInquiryMessage(params: {
  siteName: string
  carName: string
  year: number
  carId: string
  pickupDate?: string
  returnDate?: string
}) {
  const { siteName, carName, year, carId, pickupDate, returnDate } = params

  return [
    `Olá! Vim pelo ${siteName}.`,
    `Tenho interesse no veículo: ${carName} (${year}) (ID: ${carId}).`,
    pickupDate ? `Levantamento (preferência): ${pickupDate}` : null,
    returnDate ? `Devolução (preferência): ${returnDate}` : null,
    `Podem confirmar disponibilidade e condições? Obrigado!`,
  ]
    .filter(Boolean)
    .join("\n")
}
