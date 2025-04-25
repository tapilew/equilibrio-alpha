"use client";

import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  itemCount: number;
  totalAmount: number;
  onGeneratePayment?: () => void;
  isPaymentDisabled?: boolean;
}

export function CartSummary({
  itemCount = 0,
  totalAmount = 0,
  onGeneratePayment,
  isPaymentDisabled = false,
}: CartSummaryProps) {
  return (
    <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto bg-white border-t p-4 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{itemCount} Items</span>
        <span className="font-bold">Total: {totalAmount} USDC</span>
      </div>
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={onGeneratePayment}
        disabled={isPaymentDisabled}
      >
        Generate Payment Request
      </Button>
    </div>
  );
}
