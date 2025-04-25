"use client";

import { useSearchParams } from "next/navigation";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { PaymentDetails } from "@/components/payment-details";
import { PosLayout } from "@/components/pos/pos-layout";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const { customerConnectedAddress } = useWalletConnection();

  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return (
      <PosLayout>
        <div className="max-w-2xl mx-auto p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Invalid Order</h2>
            <p className="text-muted-foreground">No order ID was provided.</p>
          </div>
        </div>
      </PosLayout>
    );
  }

  return (
    <PosLayout>
      <div className="max-w-2xl mx-auto p-6">
        <PaymentDetails
          orderId={orderId}
          customerAddress={customerConnectedAddress}
        />
      </div>
    </PosLayout>
  );
}
