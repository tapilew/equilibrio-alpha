"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Monitor, LayoutDashboard } from "lucide-react"

export function ModeToggle() {
  const router = useRouter()
  const [mode, setMode] = useState<"pos" | "admin">("pos")

  useEffect(() => {
    // Check if we're in admin or pos mode based on URL
    const path = window.location.pathname
    if (path.startsWith("/admin")) {
      setMode("admin")
    } else {
      setMode("pos")
    }
  }, [])

  const switchMode = (newMode: "pos" | "admin") => {
    setMode(newMode)
    if (newMode === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/pos")
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white rounded-full shadow-md border p-1">
      <Button
        variant={mode === "pos" ? "default" : "outline"}
        size="sm"
        className="rounded-full"
        onClick={() => switchMode("pos")}
      >
        <Monitor className="h-4 w-4 mr-2" />
        POS
      </Button>
      <Button
        variant={mode === "admin" ? "default" : "outline"}
        size="sm"
        className="rounded-full"
        onClick={() => switchMode("admin")}
      >
        <LayoutDashboard className="h-4 w-4 mr-2" />
        Admin
      </Button>
    </div>
  )
}
