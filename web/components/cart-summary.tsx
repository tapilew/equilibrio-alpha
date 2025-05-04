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
    <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 bg-white border-t shadow-lg md:relative md:bottom-0 md:border md:rounded-lg md:mx-auto md:max-w-md md:mt-4">
      <div className="px-4 py-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{itemCount} Items</span>
            <span className="text-xs text-muted-foreground">in your cart</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="font-bold text-lg">{totalAmount} USDC</span>
          </div>
        </div>
        <Button
          className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
          onClick={onGeneratePayment}
          disabled={isPaymentDisabled}
        >
          Generate Payment Request
        </Button>
      </div>
    </div>
  );
}
