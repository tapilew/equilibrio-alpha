"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface PaymentConfirmationProps {
  amount: number
  timestamp: string
  network: string
  onNewSale?: () => void
}

export function PaymentConfirmation({
  amount = 12.5,
  timestamp = "14:53 UTC",
  network = "BlockDAG",
  onNewSale,
}: PaymentConfirmationProps) {
  return (
    <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
        <div className="flex-1">
          <AlertTitle className="text-green-800 text-lg font-bold">Payment Received!</AlertTitle>
          <AlertDescription className="text-green-700">
            {amount} USDC @ {timestamp}
          </AlertDescription>
          <p className="text-xs text-green-600 mt-1">Confirmed via {network} Event</p>

          {onNewSale && (
            <Button className="mt-3 bg-green-600 hover:bg-green-700 text-white" onClick={onNewSale}>
              New Sale
            </Button>
          )}
        </div>
      </div>
    </Alert>
  )
}
