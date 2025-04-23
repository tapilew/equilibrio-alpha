"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash } from "lucide-react"

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export function InvoiceForm() {
  const [customerIdentifier, setCustomerIdentifier] = useState("")
  const [lineItems, setLineItems] = useState<LineItem[]>([{ id: "1", description: "", quantity: 1, unitPrice: 0 }])

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const calculateTotal = () => {
    return lineItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  }

  return (
    <Card className="border rounded-lg">
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customerIdentifier">Customer Identifier (Optional)</Label>
            <Input
              id="customerIdentifier"
              value={customerIdentifier}
              onChange={(e) => setCustomerIdentifier(e.target.value)}
              placeholder="Email, name, or reference"
            />
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium">Line Items</div>

            {lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    variant="destructive"
                    size="icon"
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" type="button" onClick={addLineItem} className="w-full">
              Add Item
            </Button>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-bold">Total Amount:</span>
            <span className="font-bold text-lg">{calculateTotal()} USDC</span>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700" type="button">
            Generate Invoice Link
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
