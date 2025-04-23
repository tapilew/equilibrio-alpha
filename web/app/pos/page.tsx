import { PosLayout } from "@/components/pos/pos-layout"
import { ProductGrid } from "@/components/product-grid"
import { CartSummary } from "@/components/cart-summary"

export default function PosPage() {
  // Sample products with stock images
  const products = [
    {
      id: "1",
      name: "Woven Basket",
      price: 25,
      imageUrl: "https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "2",
      name: "Ceramic Vase",
      price: 32,
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b7e239e5d5e8?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "3",
      name: "Cutting Board",
      price: 18,
      imageUrl: "https://images.unsplash.com/photo-1592156328697-079f6ba4dbf2?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "4",
      name: "Blue Pillow",
      price: 22,
      imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "5",
      name: "Wooden Spoon Set",
      price: 12,
      imageUrl: "https://images.unsplash.com/photo-1584990347449-a7d69a79cd8d?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "6",
      name: "Handmade Soap",
      price: 8,
      imageUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=400&fit=crop&q=80",
    },
  ]

  return (
    <PosLayout>
      <ProductGrid products={products} />
      <CartSummary itemCount={3} totalAmount={75} onGeneratePayment={() => {}} />
    </PosLayout>
  )
}
