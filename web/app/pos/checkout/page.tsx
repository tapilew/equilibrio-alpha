"use client";

import { useState, useMemo, useEffect } from "react";
import { PosLayout } from "@/components/pos/pos-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Receipt, Mail, MessageSquare } from "lucide-react";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const { customerConnectedAddress } = useWalletConnection();
  const userId = "demo-user"; // TODO: Replace with actual user ID from auth

  // Always declare hooks at the top level
  useEffect(() => {
    if (!customerConnectedAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to access checkout.",
        variant: "destructive",
      });
      router.push("/pos");
    }
  }, [customerConnectedAddress, router, toast]);

  const queryResult = useQuery(api.myFunctions.getCartItems, { userId });
  const cartItems = useMemo(() => queryResult ?? [], [queryResult]);
  const createOrder = useMutation(api.myFunctions.createOrder);

  const aggregatedItems = useMemo(() => {
    const itemsMap = new Map();
    cartItems.forEach((item) => {
      const existing = itemsMap.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.totalPrice += item.price * item.quantity;
      } else {
        itemsMap.set(item.productId, {
          productId: item.productId,
          name: item.product?.name ?? "Product",
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          pricePerUnit: item.price,
        });
      }
    });
    return Array.from(itemsMap.values());
  }, [cartItems]);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const handlePayment = async () => {
    try {
      if (cartItems.length === 0) {
        toast({
          title: "Error",
          description: "Your cart is empty",
          variant: "destructive",
        });
        return;
      }

      if (!customerConnectedAddress) {
        toast({
          title: "Error",
          description: "Wallet not connected",
          variant: "destructive",
        });
        return;
      }

      // Create order with customer's wallet address
      const orderId = await createOrder({
        userId,
        paymentAddress: customerConnectedAddress,
      });

      router.push(`/pos/payment?orderId=${orderId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create order: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  // Show loading state if wallet is not connected
  if (!customerConnectedAddress) {
    return (
      <PosLayout>
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">Connecting wallet...</p>
            </CardContent>
          </Card>
        </div>
      </PosLayout>
    );
  }

  // Show empty cart state
  if (cartItems.length === 0) {
    return (
      <PosLayout>
        <div className="max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">Your cart is empty</p>
              <Button onClick={() => router.push("/pos")}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </PosLayout>
    );
  }

  // Show checkout page with items
  return (
    <PosLayout>
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <Button variant="ghost" onClick={() => router.push("/pos")}>
            Continue Shopping
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Order Summary
                </CardTitle>
                <CardDescription>
                  Review your items before payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aggregatedItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-start"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {item.pricePerUnit} USDC
                        </p>
                      </div>
                      <p className="font-medium">{item.totalPrice} USDC</p>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>{calculateTotal()} USDC</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Customer Information
                </CardTitle>
                <CardDescription>
                  Optional details for your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email for Order Updates</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Order Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or requests"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>
                    Secure payment with your wallet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg" onClick={handlePayment}>
                    Proceed to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PosLayout>
  );
}
