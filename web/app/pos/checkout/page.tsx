"use client"

import { useState } from "react"
import { PosLayout } from "@/components/pos/pos-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const [customerEmail, setCustomerEmail] = useState("")
  const [notes, setNotes] = useState("")

  const cartItems = [
    { id: "1", name: "Woven Basket", price: 25, quantity: 1 },
    { id: "2", name: "Ceramic Vase", price: 32, quantity: 1 },
    { id: "4", name: "Blue Pillow", price: 22, quantity: 1 },
  ]

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handlePayment = () => {
    router.push("/pos/payment")
  }

  return (
    <PosLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>{item.price * item.quantity} USDC</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{calculateTotal()} USDC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Customer Information (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes</Label>
                <Input
                  id="notes"
                  placeholder="Any special instructions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handlePayment}>
          Proceed to Payment
        </Button>
      </div>
    </PosLayout>
  )
}
