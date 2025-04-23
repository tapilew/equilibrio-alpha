"use client";

import { PosLayout } from "@/components/pos/pos-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ErrorBoundary } from "@/components/error-boundary";
import { useToast } from "@/components/ui/use-toast";

interface CartItemWithProduct {
  _id: Id<"cartItems">;
  productId: Id<"products">;
  quantity: number;
  price: number;
  product: {
    _id: Id<"products">;
    name: string;
    imageUrl: string;
  } | null;
}

export default function CartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const userId = "demo-user"; // TODO: Replace with actual user ID from auth

  const cartItems = useQuery(api.myFunctions.getCartItems, { userId }) ?? [];
  const updateQuantity = useMutation(api.myFunctions.updateCartItemQuantity);
  const removeItem = useMutation(api.myFunctions.removeFromCart);

  const handleQuantityChange = async (
    itemId: Id<"cartItems">,
    change: number,
  ) => {
    try {
      const item = cartItems.find((item) => item._id === itemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + change);
      await updateQuantity({ cartItemId: itemId, quantity: newQuantity });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (itemId: Id<"cartItems">) => {
    try {
      await removeItem({ cartItemId: itemId });
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const handleCheckout = () => {
    router.push("/pos/checkout");
  };

  return (
    <ErrorBoundary>
      <PosLayout>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => router.push("/pos")}>
                Browse Products
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-20">
                {cartItems.map((item: CartItemWithProduct) => (
                  <Card key={item._id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center p-4">
                        <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={
                              item.product?.imageUrl ??
                              `https://placehold.co/400x400/e5e7eb/a1a1aa?text=Product`
                            }
                            alt={item.product?.name ?? "Product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://placehold.co/400x400/e5e7eb/a1a1aa?text=${encodeURIComponent(item.product?.name ?? "Product")}`;
                            }}
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">
                            {item.product?.name ?? "Product"}
                          </h3>
                          <p className="text-muted-foreground">
                            {item.price} USDC
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item._id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item._id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 text-red-500"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto bg-white border-t p-4 shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {cartItems.length} Items
                  </span>
                  <span className="font-bold">
                    Total: {calculateTotal()} USDC
                  </span>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </PosLayout>
    </ErrorBoundary>
  );
}
