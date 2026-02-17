import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { CarCatalog } from "@/components/car-catalog"
import { HowItWorks } from "@/components/how-it-works"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { getPublicCars } from "@/lib/server/cars"

export default async function Home() {
  const cars = await getPublicCars()
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Faixa decorativa com cores da bandeira (opcional) */}
      <div className="flag-stripe fixed top-0 left-0 z-50"></div>
      
      <Header />
      <Hero />
      <CarCatalog cars={cars} />
      <HowItWorks />
      <About />
      <Contact cars={cars} />
      <Footer />
    </main>
  )
}