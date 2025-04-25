"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Monitor, LayoutDashboard } from "lucide-react";
import { WalletConnect } from "@/components/wallet-connect";

export type InterfaceContext = "pos" | "admin";

export function ModeToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentContext, setCurrentContext] = useState<InterfaceContext>("pos");

  useEffect(() => {
    // Determine context based on URL
    if (pathname.startsWith("/admin")) {
      setCurrentContext("admin");
    } else {
      setCurrentContext("pos");
    }
  }, [pathname]);

  const switchMode = (newMode: InterfaceContext) => {
    setCurrentContext(newMode);
    if (newMode === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/pos");
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-full shadow-md border p-1">
      {/* POS/Admin Switcher */}
      <Button
        variant={currentContext === "pos" ? "default" : "outline"}
        size="sm"
        className="rounded-full"
        onClick={() => switchMode("pos")}
      >
        <Monitor className="h-4 w-4 mr-2" />
        POS
      </Button>
      <Button
        variant={currentContext === "admin" ? "default" : "outline"}
        size="sm"
        className="rounded-full"
        onClick={() => switchMode("admin")}
      >
        <LayoutDashboard className="h-4 w-4 mr-2" />
        Admin
      </Button>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      {/* Wallet Connect Button - Pass the current context */}
      <WalletConnect context={currentContext} className="rounded-full" />
    </div>
  );
}
