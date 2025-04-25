"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Monitor, LayoutDashboard } from "lucide-react";
import { WalletConnect } from "@/components/wallet-connect";

export type InterfaceContext = "pos" | "admin";

// Memoized button component to prevent unnecessary re-renders
const ModeButton = memo(
  ({
    mode,
    currentContext,
    onClick,
    icon: Icon,
    label,
  }: {
    mode: InterfaceContext;
    currentContext: InterfaceContext;
    onClick: () => void;
    icon: React.ElementType;
    label: string;
  }) => (
    <Button
      variant={currentContext === mode ? "default" : "outline"}
      size="sm"
      className="rounded-full"
      onClick={onClick}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  ),
);

ModeButton.displayName = "ModeButton";

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

  const switchMode = useCallback(
    (newMode: InterfaceContext) => {
      setCurrentContext(newMode);
      if (newMode === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/pos");
      }
    },
    [router],
  );

  return (
    <div className="flex items-center gap-2 bg-white rounded-full shadow-md border p-1">
      <ModeButton
        mode="pos"
        currentContext={currentContext}
        onClick={() => switchMode("pos")}
        icon={Monitor}
        label="POS"
      />
      <ModeButton
        mode="admin"
        currentContext={currentContext}
        onClick={() => switchMode("admin")}
        icon={LayoutDashboard}
        label="Admin"
      />

      {/* Divider */}
      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      {/* Wallet Connect Button - Pass the current context */}
      <WalletConnect context={currentContext} className="rounded-full" />
    </div>
  );
}
