"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Search } from "lucide-react"

export function SearchForm() {
  const [pickupLocation, setPickupLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")

  return (
    <section className="relative z-20 -mt-24 mb-20">
      <div className="container mx-auto px-4">
        <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Pickup Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Local de Retirada</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Onde você quer retirar?"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Pickup Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Data de Retirada</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Return Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Data de Devolução</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold">
                <Search className="mr-2 w-5 h-5" />
                Buscar Veículos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
