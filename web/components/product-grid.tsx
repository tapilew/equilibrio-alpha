"use client";

import { ProductCard } from "./product-card";
import { Id } from "@/convex/_generated/dataModel";

interface Product {
  _id: Id<"products">;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
}

export function ProductGrid({
  products = [],
  onProductSelect,
}: ProductGridProps) {
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Artisan</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            onClick={() => onProductSelect && onProductSelect(product)}
          />
        ))}
      </div>
    </div>
  );
}
