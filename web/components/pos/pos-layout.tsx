"use client"

import type React from "react"

import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { ShoppingCart, Home, Receipt, ArrowLeft } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PosLayoutProps {
  children: React.ReactNode
}

export function PosLayout({ children }: PosLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("catalog")

  const handleNavigation = (tab: string) => {
    setActiveTab(tab)

    switch (tab) {
      case "catalog":
        router.push("/pos")
        break
      case "cart":
        router.push("/pos/cart")
        break
      case "receipts":
        router.push("/pos/receipts")
        break
      default:
        router.push("/pos")
        break
    }
  }

  // Determine if we're in a checkout flow
  const isCheckout = pathname.includes("/pos/checkout") || pathname.includes("/pos/payment")

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      {/* Header */}
      <header className="border-b p-4 flex items-center">
        {isCheckout ? (
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-white text-xl">🏇</span>
            </div>
            <h1 className="text-xl font-bold">EquiProtocol POS</h1>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-16">{children}</div>

      {/* Bottom Navigation - Only show in main POS screens, not checkout */}
      {!isCheckout && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t bg-white">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => handleNavigation("catalog")}
              className={`flex flex-col items-center justify-center w-full h-full ${
                activeTab === "catalog" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Catalog</span>
            </button>

            <button
              onClick={() => handleNavigation("cart")}
              className={`flex flex-col items-center justify-center w-full h-full ${
                activeTab === "cart" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-xs mt-1">Cart</span>
            </button>

            <button
              onClick={() => handleNavigation("receipts")}
              className={`flex flex-col items-center justify-center w-full h-full ${
                activeTab === "receipts" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Receipt className="h-6 w-6" />
              <span className="text-xs mt-1">Receipts</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode Toggle */}
      <ModeToggle />
    </div>
  )
}
