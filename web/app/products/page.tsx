import { AppShell } from "@/components/app-shell"
import { ProductGrid } from "@/components/product-grid"

export default function ProductsPage() {
  return (
    <AppShell>
      <ProductGrid products={[]} />
    </AppShell>
  )
}
