"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PosLayout } from "@/components/pos/pos-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";

// Interface for aggregated items (can be shared or defined locally)
interface AggregatedOrderItem {
  productId: Id<"products">;
  name: string;
  quantity: number;
  totalPrice: number;
}

export default function ReceiptPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as Id<"orders"> | undefined;

  // Fetch the specific order
  const order = useQuery(
    api.myFunctions.getOrder,
    orderId ? { orderId } : "skip",
  );

  // Fetch product details (needed if getOrder doesn't populate them)
  // NOTE: Assuming getOrder returns items with productId, quantity, price.
  //       If not, we'd need another query or adjust getOrder.
  //       For now, let's assume product names need fetching IF needed.
  //       A potentially better approach is to enhance getOrder to return product details.
  //       Let's proceed assuming order.items has necessary info for now.

  // Aggregate items (similar to checkout)
  const aggregatedItems = useMemo(() => {
    if (!order?.items) return [];
    const itemsMap = new Map<Id<"products">, AggregatedOrderItem>();
    order.items.forEach((item) => {
      // TODO: Ideally, getOrder would join product names.
      //       If not, we'd need a separate query or lookup.
      //       Using productId as a placeholder name if product info isn't readily available.
      const productName = `Product ${item.productId.substring(0, 6)}...`; // Placeholder
      const existing = itemsMap.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.totalPrice += item.price * item.quantity;
      } else {
        itemsMap.set(item.productId, {
          productId: item.productId,
          name: productName, // Use placeholder or fetched name
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
        });
      }
    });
    return Array.from(itemsMap.values());
  }, [order?.items]);

  const handleShopMore = () => {
    router.push("/pos");
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "paid":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600 mr-2" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600 mr-2" />;
      case "cancelled":
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600 mr-2" />;
      default:
        return null;
    }
  };

  if (order === undefined) {
    // Loading state
    return (
      <PosLayout>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Loading Receipt...</h2>
        </div>
      </PosLayout>
    );
  }

  if (order === null) {
    // Order not found state
    return (
      <PosLayout>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Receipt Not Found
          </h2>
          <p className="mb-4">
            The requested order receipt could not be found.
          </p>
          <Button onClick={handleShopMore}>Go to Catalog</Button>
        </div>
      </PosLayout>
    );
  }

  return (
    <ErrorBoundary>
      <PosLayout>
        <div className="p-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Order Receipt</h2>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aggregatedItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      {item.totalPrice.toFixed(2)} USDC
                    </span>
                  </div>
                ))}
                <Separator className="my-3" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)} USDC</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <span className="font-medium">Order ID:</span>
                <span>{order._id}</span>

                <span className="font-medium">Date:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>

                <span className="font-medium">Status:</span>
                <span className="flex items-center capitalize">
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>

                <span className="font-medium">Payment Address:</span>
                <span className="truncate">{order.paymentAddress}</span>

                {order.paymentHash && (
                  <>
                    <span className="font-medium">Transaction Hash:</span>
                    <span className="truncate">{order.paymentHash}</span>
                    {/* TODO: Add link to block explorer */}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={handleShopMore}>Shop More</Button>
          </div>
        </div>
      </PosLayout>
    </ErrorBoundary>
  );
}
