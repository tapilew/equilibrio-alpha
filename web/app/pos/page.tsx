"use client";

import { useRouter } from "next/navigation";
import { PosLayout } from "@/components/pos/pos-layout";
import { ProductGrid } from "@/components/product-grid";
import { CartSummary } from "@/components/cart-summary";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function PosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const userId = "demo-user"; // TODO: Replace with actual user ID from auth

  const products = useQuery(api.myFunctions.listProducts) ?? [];
  const cartItems = useQuery(api.myFunctions.getCartItems, { userId }) ?? [];
  const addToCart = useMutation(api.myFunctions.addToCart);
  const createProduct = useMutation(api.myFunctions.createProduct);

  // Initialize products if none exist
  useEffect(() => {
    if (products.length === 0) {
      const sampleProducts = [
        {
          name: "Woven Basket",
          price: 25,
          imageUrl:
            "https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?w=400&h=400&fit=crop&q=80",
          stock: 10,
        },
        {
          name: "Ceramic Vase",
          price: 32,
          imageUrl:
            "https://images.unsplash.com/photo-1612196808214-b7e239e5d5e8?w=400&h=400&fit=crop&q=80",
          stock: 5,
        },
        {
          name: "Cutting Board",
          price: 18,
          imageUrl:
            "https://images.unsplash.com/photo-1592156328697-079f6ba4dbf2?w=400&h=400&fit=crop&q=80",
          stock: 15,
        },
        {
          name: "Blue Pillow",
          price: 22,
          imageUrl:
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=400&fit=crop&q=80",
          stock: 8,
        },
      ];

      sampleProducts.forEach((product) => {
        createProduct(product).catch((error) => {
          console.error("Failed to create product:", error);
        });
      });
    }
  }, [products.length, createProduct]);

  const handleAddToCart = async (product: {
    _id: Id<"products">;
    name: string;
    price: number;
    imageUrl: string;
  }) => {
    try {
      await addToCart({
        userId,
        productId: product._id,
        quantity: 1,
      });
      toast({
        title: "Success",
        description: "Added to cart",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePayment = () => {
    router.push("/pos/checkout");
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  return (
    <PosLayout>
      <ProductGrid products={products} onProductSelect={handleAddToCart} />
      <CartSummary
        itemCount={cartItems.length}
        totalAmount={calculateTotal()}
        onGeneratePayment={handleGeneratePayment}
      />
    </PosLayout>
  );
}
