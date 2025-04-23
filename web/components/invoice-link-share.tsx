"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Share2, CheckCircle } from "lucide-react"

interface InvoiceLinkShareProps {
  invoiceId: string
  totalAmount: number
  shareableLink: string
}

export function InvoiceLinkShare({
  invoiceId = "INV-001",
  totalAmount = 75.5,
  shareableLink = "https://equiprotocol.io/pay/INV-001",
}: InvoiceLinkShareProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Card className="border rounded-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Invoice #{invoiceId} Created</span>
          <Badge variant="outline">Status: Pending Payment</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-2xl font-bold">{totalAmount} USDC</span>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Shareable Link</div>
          <div className="flex gap-2">
            <Input readOnly value={shareableLink} className="flex-1" />
            <Button onClick={handleCopyLink} className="flex-shrink-0">
              {isCopied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Share2 className="h-4 w-4 mr-2" />
          Share via...
        </Button>
      </CardContent>
    </Card>
  )
}
