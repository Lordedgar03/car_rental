"use client"

import React, { useRef } from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, X, Check, Upload, Link, ImageIcon, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Car as DbCar } from "@/lib/types"

const categories = ["SUV", "Sedan", "Esportivo", "Pickup", "Compacto"] as const
const transmissions = ["Automático", "Manual"] as const
const fuels = ["Gasolina", "Diesel", "Híbrido", "Elétrico", "Flex"] as const

const defaultImages = [
  "/images/car-suv.jpg",
  "/images/car-sedan.jpg",
  "/images/car-sports.jpg",
  "/images/car-pickup.jpg",
  "/images/car-compact.jpg",
]

type UiCar = {
  id: string
  name: string
  category: string
  image: string
  passengers: number
  transmission: string
  fuel: string
  price: number
  featured: boolean
  available: boolean
  year: number
  description?: string | null
}

const emptyForm: Omit<UiCar, "id"> = {
  name: "",
  category: "Sedan",
  image: "/images/car-sedan.jpg",
  passengers: 5,
  transmission: "Automático",
  fuel: "Gasolina",
  price: 200,
  featured: false,
  available: true,
  year: new Date().getFullYear(),
  description: "",
}

function dbToUiCar(c: DbCar): UiCar {
  return {
    id: c.id,
    name: c.name,
    category: c.category,
    image: c.imageUrl,
    passengers: c.passengers,
    transmission: c.transmission,
    fuel: c.fuel,
    price: c.pricePerDay,
    featured: c.featured,
    available: c.availabilityStatus === "available",
    year: c.year,
    description: c.description ?? "",
  }
}

function uiToPayload(form: Omit<UiCar, "id">) {
  return {
    name: form.name,
    category: form.category,
    imageUrl: form.image,
    passengers: form.passengers,
    transmission: form.transmission,
    fuel: form.fuel,
    pricePerDay: form.price,
    featured: form.featured,
    availabilityStatus: form.available ? "available" : "unavailable",
    year: form.year,
    description: form.description ?? null,
  }
}

export default function AdminCarsPage() {
  const [cars, setCars] = useState<UiCar[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<UiCar | null>(null)
  const [formData, setFormData] = useState<Omit<UiCar, "id">>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [imageMode, setImageMode] = useState<"preset" | "upload" | "url">("preset")
  const [imageUrl, setImageUrl] = useState("")
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadCars = async () => {
    const res = await fetch("/api/admin/cars", { cache: "no-store" }).catch(() => null)
    const json = await res?.json().catch(() => null)
    const list: DbCar[] = Array.isArray(json?.cars) ? json.cars : []
    setCars(list.filter((c) => c.isActive).map(dbToUiCar))
  }

  useEffect(() => {
    loadCars()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetImageState = () => {
    setImageMode("preset")
    setImageUrl("")
    setUploadPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const openAddModal = () => {
    setEditingCar(null)
    setFormData(emptyForm)
    resetImageState()
    setIsModalOpen(true)
  }

  const openEditModal = (car: UiCar) => {
    setEditingCar(car)
    setFormData({
      name: car.name,
      category: car.category,
      image: car.image,
      passengers: car.passengers,
      transmission: car.transmission,
      fuel: car.fuel,
      price: car.price,
      featured: car.featured,
      available: car.available,
      year: car.year,
      description: car.description ?? "",
    })
    resetImageState()
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCar(null)
    setFormData(emptyForm)
    resetImageState()
  }

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === "string") {
        setUploadPreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) return

    if (editingCar) {
      await fetch(`/api/admin/cars/${editingCar.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uiToPayload(formData)),
      }).catch(() => null)
    } else {
      await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uiToPayload(formData)),
      }).catch(() => null)
    }

    await loadCars()
    closeModal()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/cars/${id}`, { method: "DELETE" }).catch(() => null)
    await loadCars()
    setDeleteConfirm(null)
  }

  const toggleAvailability = async (id: string) => {
    const current = cars.find((c) => c.id === id)
    if (!current) return
    const nextAvailable = !current.available

    await fetch(`/api/admin/cars/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availabilityStatus: nextAvailable ? "available" : "unavailable" }),
    }).catch(() => null)

    setCars((prev) => prev.map((c) => (c.id === id ? { ...c, available: nextAvailable } : c)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Veículos</h1>
          <p className="text-muted-foreground mt-1">Adicionar e gerenciar carros disponíveis</p>
        </div>
        <Button onClick={openAddModal} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Carro
        </Button>
      </div>

      {/* Cars Grid */}
      {cars.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <CarIcon />
          <h3 className="text-lg font-semibold text-foreground mt-4">Nenhum veículo cadastrado</h3>
          <p className="text-muted-foreground mt-2">Comece adicionando seu primeiro veículo ao sistema.</p>
          <Button onClick={openAddModal} className="mt-6">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Carro
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className={`bg-card border border-border rounded-xl overflow-hidden ${
                !car.available ? "opacity-75" : ""
              }`}
            >
              <div className="relative h-48 bg-muted">
                <Image src={car.image} alt={car.name} fill className="object-cover" />
                {car.featured && (
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    Destaque
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      car.available ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {car.available ? "Disponível" : "Indisponível"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{car.name}</h3>
                    <p className="text-sm text-muted-foreground">{car.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">STN {car.price}/dia</div>
                    <div className="text-xs text-muted-foreground">{car.year}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-muted/50 rounded-lg py-2">
                    <div className="text-sm font-medium text-foreground">{car.passengers}</div>
                    <div className="text-xs text-muted-foreground">Pessoas</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg py-2">
                    <div className="text-sm font-medium text-foreground">{car.transmission}</div>
                    <div className="text-xs text-muted-foreground">Câmbio</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg py-2">
                    <div className="text-sm font-medium text-foreground">{car.fuel}</div>
                    <div className="text-xs text-muted-foreground">Combustível</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(car)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleAvailability(car.id)}
                  >
                    {car.available ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => setDeleteConfirm(car.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Delete confirmation */}
                {deleteConfirm === car.id && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-foreground mb-2">Remover este carro do site?</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(car.id)}>
                        Sim, remover
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {editingCar ? "Editar Carro" : "Adicionar Novo Carro"}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Nome do Carro *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ex: Honda Civic 2024"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Categoria</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Ano</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                        className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        min="1950"
                        max="2100"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Section */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground">Imagem do Carro</label>

                  {/* Image Preview */}
                  <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                  </div>

                  {/* Image Mode Selector */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={imageMode === "preset" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageMode("preset")}
                    >
                      <ImageIcon className="w-4 h-4 mr-1" />
                      Padrão
                    </Button>
                    <Button
                      type="button"
                      variant={imageMode === "upload" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageMode("upload")}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant={imageMode === "url" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageMode("url")}
                    >
                      <Link className="w-4 h-4 mr-1" />
                      URL
                    </Button>
                  </div>

                  {/* Preset Images */}
                  {imageMode === "preset" && (
                    <div className="grid grid-cols-5 gap-2">
                      {defaultImages.map((img, idx) => (
                        <button
                          key={img}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: img })}
                          className={`relative h-16 rounded-lg overflow-hidden border-2 ${
                            formData.image === img ? "border-primary" : "border-border"
                          }`}
                        >
                          <Image src={img} alt={`Preset ${idx}`} fill className="object-cover" />
                          {formData.image === img && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Upload */}
                  {imageMode === "upload" && (
                    <div className="space-y-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file)
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Selecionar Imagem
                      </Button>
                      {uploadPreview && (
                        <p className="text-xs text-muted-foreground">Imagem carregada (base64)</p>
                      )}
                    </div>
                  )}

                  {/* URL */}
                  {imageMode === "url" && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (imageUrl.trim()) setFormData({ ...formData, image: imageUrl.trim() })
                        }}
                      >
                        Aplicar URL
                      </Button>
                    </div>
                  )}
                </div>

                {/* Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Passageiros</label>
                    <input
                      type="number"
                      value={formData.passengers}
                      onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
                      className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      min="1"
                      max="20"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Preço por Dia</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Transmissão</label>
                    <select
                      value={formData.transmission}
                      onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {transmissions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Combustível</label>
                    <select
                      value={formData.fuel}
                      onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {fuels.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Descrição</label>
                  <textarea
                    value={formData.description ?? ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[90px]"
                    placeholder="Detalhes opcionais do veículo..."
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Veículo em Destaque</div>
                    <div className="text-sm text-muted-foreground">Aparece primeiro na lista pública</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.featured ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        formData.featured ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    {editingCar ? "Salvar Alterações" : "Adicionar Carro"}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function CarIcon() {
  return (
    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
      <Car className="w-8 h-8 text-primary" />
    </div>
  )
}
