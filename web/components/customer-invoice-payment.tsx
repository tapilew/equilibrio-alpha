"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy } from "lucide-react"
import { useState } from "react"

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

interface CustomerInvoicePaymentProps {
  merchantName: string
  invoiceId: string
  items: InvoiceItem[]
  totalAmount: number
  receivingAddress: string
  network: string
}

export function CustomerInvoicePayment({
  merchantName = "Artisan Crafts",
  invoiceId = "INV-001",
  items = [
    { description: "Woven Basket", quantity: 1, unitPrice: 25 },
    { description: "Ceramic Vase", quantity: 1, unitPrice: 32 },
  ],
  totalAmount = 57,
  receivingAddress = "0xCD265CSa3192cgF482F77C3add57A0c26361E53",
  network = "BlockDAG",
}: CustomerInvoicePaymentProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(receivingAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">{merchantName}</h2>
        <h3 className="text-xl mt-2">Invoice #{invoiceId}</h3>

        <Card className="mt-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.unitPrice} USDC</TableCell>
                    <TableCell className="text-right">{item.quantity * item.unitPrice} USDC</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Amount Due:
                  </TableCell>
                  <TableCell className="text-right font-bold">{totalAmount} USDC</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="px-3 py-1">
              Network: {network}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Pay to:</span>
            <code className="text-xs bg-gray-100 p-2 rounded flex-1 overflow-hidden overflow-ellipsis">
              {receivingAddress}
            </code>
            <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* QR Code Placeholder */}
          <div className="w-48 h-48 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <span className="text-gray-500">[QR Code Area]</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">Scan with your crypto wallet to pay</p>

          <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
            Pay {totalAmount} USDC via Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
