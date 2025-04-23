"use client"

import { useState } from "react"
import { PosLayout } from "@/components/pos/pos-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Woven Basket",
      price: 25,
      quantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "2",
      name: "Ceramic Vase",
      price: 32,
      quantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b7e239e5d5e8?w=400&h=400&fit=crop&q=80",
    },
    {
      id: "4",
      name: "Blue Pillow",
      price: 22,
      quantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=400&fit=crop&q=80",
    },
  ])

  const updateQuantity = (id: string, change: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change)
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    router.push("/pos/checkout")
  }

  return (
    <PosLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => router.push("/pos")}>Browse Products</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-20">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center p-4">
                      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.src = "/placeholder.svg?height=100&width=100"
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-muted-foreground">{item.price} USDC</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto bg-white border-t p-4 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{cartItems.length} Items</span>
                <span className="font-bold">Total: {calculateTotal()} USDC</span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </PosLayout>
  )
}
