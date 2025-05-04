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
    <div className="space-y-4">
      <h2 className="text-xl font-bold px-4 xs:text-2xl sm:text-3xl">
        Artisan
      </h2>
      <div className="grid grid-cols-1 gap-3 px-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xs:gap-4 xs:px-4">
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
