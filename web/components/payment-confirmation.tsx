"use client";

import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentConfirmationProps {
  amount: number;
  timestamp: string;
  network: string;
}

export function PaymentConfirmation({
  amount,
  timestamp,
  network,
}: PaymentConfirmationProps) {
  return (
    <Card className="mb-4 bg-green-50 border-green-200">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <div>
            <h3 className="text-xl font-semibold text-green-700">
              Payment Successful!
            </h3>
            <p className="text-sm text-green-600 mt-1">
              Your payment has been processed successfully
            </p>
          </div>
          <div className="w-full space-y-2 text-sm text-green-700">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">{amount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-medium">{timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="font-medium">{network}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
