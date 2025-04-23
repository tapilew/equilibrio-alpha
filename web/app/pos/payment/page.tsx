"use client";

import { useEffect, useState } from "react";
import { PosLayout } from "@/components/pos/pos-layout";
import { PaymentRequestDisplay } from "@/components/payment-request-display";
import { PaymentConfirmation } from "@/components/payment-confirmation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ErrorBoundary } from "@/components/error-boundary";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const orderIdParam = searchParams.get("orderId");
  const orderId = orderIdParam ? (orderIdParam as Id<"orders">) : null;
  const order = useQuery(api.myFunctions.getOrder, {
    orderId: orderId ?? ("" as Id<"orders">),
  });
  const updateOrderStatus = useMutation(api.myFunctions.updateOrderStatus);

  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "paid" | "error"
  >("pending");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push("/pos/cart");
      return;
    }

    // TODO: Implement actual payment monitoring
    // This is a mock implementation
    const checkPayment = async () => {
      try {
        // Simulate payment check
        const isPaid = Math.random() > 0.5;
        if (isPaid) {
          setPaymentStatus("paid");
          await updateOrderStatus({
            orderId,
            status: "paid",
            paymentHash: "0x123...", // TODO: Get actual transaction hash
          });
          toast({
            title: "Payment Successful",
            description: "Your order has been confirmed",
          });
        }
      } catch {
        setPaymentStatus("error");
        setError("Failed to process payment");
        toast({
          title: "Payment Error",
          description: "Failed to process payment. Please try again.",
          variant: "destructive",
        });
      }
    };

    const interval = setInterval(checkPayment, 5000);
    return () => clearInterval(interval);
  }, [orderId, updateOrderStatus, router, toast]);

  const handleCancel = () => {
    router.push("/pos/cart");
  };

  const handleComplete = () => {
    router.push("/pos/receipts");
  };

  if (!order) {
    return (
      <PosLayout>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </PosLayout>
    );
  }

  return (
    <ErrorBoundary>
      <PosLayout>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Payment</h2>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Order Total: {order.total} USDC</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="qr">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="qr">QR Code</TabsTrigger>
                  <TabsTrigger value="link">Payment Link</TabsTrigger>
                </TabsList>
                <TabsContent value="qr" className="pt-4">
                  <PaymentRequestDisplay
                    amount={order.total}
                    receivingAddress={order.paymentAddress}
                    network="BlockDAG (Demo)"
                  />
                </TabsContent>
                <TabsContent value="link" className="pt-4">
                  <div className="text-center space-y-4">
                    <p>Share this payment link with your customer:</p>
                    <div className="bg-gray-100 p-3 rounded-md text-sm overflow-hidden overflow-ellipsis">
                      https://equiprotocol.io/pay/{order._id}
                    </div>
                    <Button className="w-full">Copy Payment Link</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {paymentStatus === "paid" && (
            <PaymentConfirmation
              amount={order.total}
              timestamp={new Date().toLocaleTimeString()}
              network="BlockDAG"
              onNewSale={() => {}}
            />
          )}

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancel Payment
            </Button>
            <Button
              onClick={handleComplete}
              disabled={paymentStatus !== "paid"}
            >
              Complete Sale
            </Button>
          </div>
        </div>
      </PosLayout>
    </ErrorBoundary>
  );
}
