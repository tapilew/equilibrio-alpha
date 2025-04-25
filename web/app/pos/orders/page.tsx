"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PosLayout } from "@/components/pos/pos-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { Receipt, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function OrdersPage() {
  const router = useRouter();
  const { customerConnectedAddress } = useWalletConnection();
  const userId = "demo-user"; // TODO: Replace with actual user ID from auth

  // Fetch user's orders
  const orders = useQuery(api.myFunctions.getUserOrders, { userId }) ?? [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
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
              <p className="text-muted-foreground mb-6">
                Please connect your wallet to view orders
              </p>
            </CardContent>
          </Card>
        </div>
      </PosLayout>
    );
  }

  return (
    <PosLayout>
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Order History</h2>
          <Button variant="ghost" onClick={() => router.push("/pos")}>
            Continue Shopping
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">No orders found</p>
              <Button onClick={() => router.push("/pos")}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Receipt className="h-5 w-5" />
                      Order #{order._id.slice(-6)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="text-sm capitalize">{order.status}</span>
                    </div>
                  </div>
                  <CardDescription>
                    {new Date(order.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex justify-between items-start"
                      >
                        <div>
                          <p className="font-medium">
                            Product #{item.productId.slice(-6)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {item.price} USDC
                          </p>
                        </div>
                        <p className="font-medium">
                          {item.quantity * item.price} USDC
                        </p>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-bold">
                      <span>Total</span>
                      <span>{order.total} USDC</span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => router.push(`/pos/receipt/${order._id}`)}
                    >
                      View Receipt
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PosLayout>
  );
}
