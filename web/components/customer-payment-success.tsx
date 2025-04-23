"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Copy, ExternalLink, Download } from "lucide-react"
import { useState } from "react"

interface CustomerPaymentSuccessProps {
  amount: number
  network: string
  transactionHash: string
  explorerUrl?: string
}

export function CustomerPaymentSuccess({
  amount = 57,
  network = "BlockDAG",
  transactionHash = "0x8f6e5d4c3b2a1908f7e6d5c4b3a2190",
  explorerUrl = "#",
}: CustomerPaymentSuccessProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyHash = () => {
    navigator.clipboard.writeText(transactionHash)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
              <div>
                <AlertTitle className="text-green-800 text-lg font-bold">Payment Successful!</AlertTitle>
                <AlertDescription className="text-green-700">
                  {amount} USDC has been sent successfully.
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <div className="space-y-4 mt-6">
            <div>
              <div className="text-sm font-medium mb-1">Network</div>
              <div className="text-sm">{network}</div>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Transaction Hash</div>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-gray-100 p-2 rounded flex-1 overflow-hidden overflow-ellipsis">
                  {transactionHash}
                </code>
                <Button variant="ghost" size="icon" onClick={handleCopyHash}>
                  {isCopied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <Button className="w-full mt-4">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
