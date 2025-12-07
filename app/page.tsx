import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories"
import { WorkersGrid } from "@/components/home/workers-grid"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <CategoriesSection />
        <WorkersGrid />
      </main>
      <Footer />
    </>
  )
}
