"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { PaymentConfirmation } from "@/components/payment-confirmation";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Receipt,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useWalletClient } from "wagmi";

interface PaymentDetailsProps {
  orderId: string;
  customerAddress: string | null;
}

export function PaymentDetails({
  orderId,
  customerAddress,
}: PaymentDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "paid" | "error"
  >("pending");
  const [signatureStatus, setSignatureStatus] = useState<
    "pending" | "signed" | "error"
  >("pending");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();
  const isHydrated = useRef(false);

  const order = useQuery(
    api.myFunctions.getOrder,
    orderId ? { orderId: orderId as Id<"orders"> } : "skip",
  );

  // Mark component as hydrated after first render
  useEffect(() => {
    isHydrated.current = true;
  }, []);

  // Handle order status changes
  useEffect(() => {
    if (!order || !isHydrated.current) return;

    if (order.status === "paid" || order.status === "completed") {
      setPaymentStatus("paid");
      setError(null);
      setProgress(100);
    } else if (order.status === "cancelled" || order.status === "failed") {
      setPaymentStatus("error");
      setError(`Order status: ${order.status}`);
      setProgress(0);
    } else {
      setPaymentStatus("pending");
      setError(null);
      setProgress(0);
    }
  }, [order]);

  // Handle progress updates
  useEffect(() => {
    if (paymentStatus !== "processing" || !isHydrated.current) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [paymentStatus]);

  const handleSignature = useCallback(async () => {
    if (!order || !customerAddress || !walletClient || !isHydrated.current) {
      toast({
        title: "Error",
        description: "Unable to process signature. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSignatureStatus("pending");

      const message = `I authorize the payment of ${order.total} USDC for order ${order._id}`;

      const signature = await walletClient.signMessage({
        message,
        account: customerAddress as `0x${string}`,
      });

      if (signature) {
        setSignatureStatus("signed");
        await handlePayment();
      }
    } catch (err) {
      setSignatureStatus("error");
      setError("Failed to sign the transaction. Please try again.");
      toast({
        title: "Signature Failed",
        description:
          err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }, [order, customerAddress, walletClient, toast]);

  const handlePayment = useCallback(async () => {
    if (!order || !customerAddress || !isHydrated.current) return;

    try {
      setPaymentStatus("processing");
      setProgress(10);

      // TODO: Implement actual payment logic here
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentStatus("paid");
      setProgress(100);
      toast({
        title: "Payment Successful",
        description: `Payment of ${order.total} USDC completed.`,
      });
    } catch (err) {
      setPaymentStatus("error");
      setError("Payment failed. Please try again.");
      setProgress(0);
      toast({
        title: "Payment Failed",
        description:
          err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }, [order, customerAddress, toast]);

  const handleCancel = useCallback(() => {
    if (!isHydrated.current) return;
    router.push("/pos/cart");
  }, [router]);

  const handleComplete = useCallback(() => {
    if (!order || !isHydrated.current) return;
    router.push(`/pos/receipt/${order._id}`);
  }, [order, router]);

  // Show loading state during hydration
  if (!isHydrated.current) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Payment</h2>
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Total
            </span>
            <span>{order.total} USDC</span>
          </CardTitle>
          <CardDescription>
            Complete the payment using your connected wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!customerAddress ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Not Connected</AlertTitle>
              <AlertDescription>
                Please connect your customer wallet to make the payment.
              </AlertDescription>
            </Alert>
          ) : paymentStatus === "pending" ? (
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Signature Required</AlertTitle>
                <AlertDescription>
                  Please sign the message to authorize the payment of{" "}
                  {order.total} USDC.
                </AlertDescription>
              </Alert>
              <Button
                size="lg"
                className="w-full"
                onClick={handleSignature}
                disabled={signatureStatus === "pending"}
              >
                {signatureStatus === "pending" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  "Sign to Pay"
                )}
              </Button>
            </div>
          ) : paymentStatus === "processing" ? (
            <div className="space-y-4">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">
                Processing your payment...
              </p>
            </div>
          ) : paymentStatus === "paid" ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Payment Successful</AlertTitle>
              <AlertDescription>
                Your payment has been processed successfully.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Payment Failed</AlertTitle>
              <AlertDescription>
                {error || "An error occurred during payment. Please try again."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {paymentStatus === "paid" && (
        <PaymentConfirmation
          amount={order.total}
          timestamp={new Date().toLocaleTimeString()}
          network="BlockDAG"
        />
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleComplete}
          disabled={paymentStatus !== "paid"}
          size="lg"
        >
          View Receipt
          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
        </Button>
      </div>
    </div>
  );
}
