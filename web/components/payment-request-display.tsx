"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

interface PaymentRequestDisplayProps {
  amount: number
  receivingAddress: string
  network: string
}

export function PaymentRequestDisplay({
  amount = 0,
  receivingAddress = "0xCD265CSa3192cgF482F77C3add57A0c26361E53",
  network = "BlockDAG (Demo)",
}: PaymentRequestDisplayProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(receivingAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-6">Amount Due: {amount} USDC</h2>

      {/* QR Code Placeholder */}
      <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6 bg-gray-50">
        <span className="text-gray-500">[QR Code Area]</span>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-center mb-2">
          <Badge variant="outline" className="px-3 py-1">
            Network: {network}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium">Pay to:</span>
          <code className="text-xs bg-gray-100 p-2 rounded flex-1 overflow-hidden overflow-ellipsis">
            {receivingAddress}
          </code>
          <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
            {isCopied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex justify-center">
          <Badge variant="outline" className="px-3 py-1">
            Waiting for Payment...
          </Badge>
        </div>
      </div>
    </div>
  )
}
