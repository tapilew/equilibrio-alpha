"use client"

import { ProductCard } from "./product-card"

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
}

interface ProductGridProps {
  products: Product[]
  onProductSelect?: (product: Product) => void
}

export function ProductGrid({ products = [], onProductSelect }: ProductGridProps) {
  // Sample products with stock images if none provided
  const sampleProducts: Product[] = [
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
  ]

  const displayProducts = products.length > 0 ? products : sampleProducts

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Artisan</h2>
      <div className="grid grid-cols-2 gap-4">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            onClick={() => onProductSelect && onProductSelect(product)}
          />
        ))}
      </div>
    </div>
  )
}
