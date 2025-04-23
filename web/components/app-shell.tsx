"use client"

import type React from "react"
import { LayoutGrid, DollarSign, Activity, Settings } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("products")

  // Update activeTab based on current pathname
  useEffect(() => {
    if (pathname.includes("/products")) {
      setActiveTab("products")
    } else if (pathname.includes("/sell")) {
      setActiveTab("sell")
    } else if (pathname.includes("/activity")) {
      setActiveTab("activity")
    } else if (pathname.includes("/settings")) {
      setActiveTab("settings")
    } else if (pathname === "/") {
      setActiveTab("home")
    }
  }, [pathname])

  const handleNavigation = (tab: string) => {
    setActiveTab(tab)

    switch (tab) {
      case "products":
        router.push("/products")
        break
      case "sell":
        router.push("/sell")
        break
      case "activity":
        router.push("/activity")
        break
      case "settings":
        router.push("/settings")
        break
      default:
        router.push("/")
        break
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white">
      <div className="flex-1 overflow-auto pb-16">{children}</div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t bg-white">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => handleNavigation("products")}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === "products" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <LayoutGrid className="h-6 w-6" />
            <span className="text-xs mt-1">Products</span>
          </button>

          <button
            onClick={() => handleNavigation("sell")}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === "sell" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <DollarSign className="h-6 w-6" />
            <span className="text-xs mt-1">Sell</span>
          </button>

          <button
            onClick={() => handleNavigation("activity")}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === "activity" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Activity className="h-6 w-6" />
            <span className="text-xs mt-1">Activity</span>
          </button>

          <button
            onClick={() => handleNavigation("settings")}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === "settings" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
