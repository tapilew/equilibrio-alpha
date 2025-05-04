"use client";

import { memo, useMemo, useCallback } from "react";
import type React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertCircle,
  Home,
  ShoppingCart,
  ArrowLeft,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { Card, CardContent } from "@/components/ui/card";
import { NetworkSelector } from "@/components/network-selector";
import { ModeToggle } from "@/components/mode-toggle";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { LayoutToggle } from "@/components/layout-toggle";

interface PosLayoutProps {
  children: React.ReactNode;
}

const NavButton = memo(
  ({
    item,
    isActive,
    onClick,
  }: {
    item: { name: string; icon: React.ElementType; value: string };
    isActive: boolean;
    onClick: () => void;
  }) => {
    const Icon = item.icon;
    return (
      <Button
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start",
          isActive ? "bg-blue-50 text-blue-600" : "",
        )}
        onClick={onClick}
      >
        <Icon className="h-5 w-5 mr-3" />
        {item.name}
      </Button>
    );
  },
);
NavButton.displayName = "NavButton";

const MobileNavButton = memo(
  ({
    item,
    isActive,
    onClick,
  }: {
    item: { name: string; icon: React.ElementType; value: string };
    isActive: boolean;
    onClick: () => void;
  }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex flex-col items-center justify-center w-full h-full",
          isActive ? "text-blue-600" : "text-gray-500",
        )}
      >
        <Icon className="h-6 w-6" />
        <span className="text-xs mt-1">{item.name}</span>
      </button>
    );
  },
);
MobileNavButton.displayName = "MobileNavButton";

const TopBar = memo(
  ({
    isCustomerConnected,
    requiresWallet,
  }: {
    isCustomerConnected: boolean;
    requiresWallet: boolean;
  }) => (
    <div className="sticky top-0 z-10 bg-white border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          {!isCustomerConnected && requiresWallet && (
            <div className="flex items-center text-yellow-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="hidden xs:inline">
                Customer wallet not connected
              </span>
              <span className="xs:hidden">Connect wallet</span>
            </div>
          )}
          <NetworkSelector className="w-[140px] xs:w-[180px]" />
        </div>
        <div className="flex items-center space-x-3">
          <LayoutToggle />
          <div className="h-6 w-px bg-gray-200"></div>
          <ModeToggle />
        </div>
      </div>
    </div>
  ),
);
TopBar.displayName = "TopBar";

export function PosLayout({ children }: PosLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { customerConnectedAddress } = useWalletConnection();
  const isCustomerConnected = !!customerConnectedAddress;

  const handleNavigation = useCallback(
    (targetPath: string) => {
      router.push(targetPath);
    },
    [router],
  );

  // Determine if we're in a checkout flow
  const isCheckout = useMemo(
    () =>
      pathname.includes("/pos/checkout") || pathname.includes("/pos/payment"),
    [pathname],
  );

  // Determine if we're in the cart or checkout flow
  const requiresWallet = useMemo(
    () => pathname.includes("/pos/cart") || isCheckout,
    [pathname, isCheckout],
  );

  const navItems = useMemo(
    () => [
      {
        name: "Catalog",
        icon: Home,
        value: "catalog",
        path: "/pos",
      },
      {
        name: "Cart",
        icon: ShoppingCart,
        value: "cart",
        path: "/pos/cart",
      },
      {
        name: "Orders",
        icon: Receipt,
        value: "orders",
        path: "/pos/orders",
      },
    ],
    [],
  );

  // Helper to determine if a path is active
  const isActive = useCallback(
    (itemPath: string) => {
      if (itemPath === "/pos") {
        return pathname === "/pos" || pathname === "/pos/";
      }
      return pathname.startsWith(itemPath);
    },
    [pathname],
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header - Mobile First */}
      <header className="sticky top-0 z-20 bg-white border-b">
        <div className="flex items-center h-14 px-4 pt-safe-top">
          {isCheckout ? (
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center md:w-10 md:h-10">
                <span className="text-white text-lg md:text-xl">🏇</span>
              </div>
              <h1 className="text-lg font-bold md:text-xl">EquiProtocol POS</h1>
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <WalletConnectButton />
            <div className="hidden xs:block">
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* Network Bar */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isCustomerConnected && requiresWallet && (
              <div className="flex items-center text-yellow-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="hidden xs:inline">
                  Customer wallet not connected
                </span>
                <span className="xs:hidden">Connect wallet</span>
              </div>
            )}
            <NetworkSelector className="w-[140px] xs:w-[180px]" />
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col w-full pt-32">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <NavButton
                key={item.value}
                item={item}
                isActive={isActive(item.path)}
                onClick={() => handleNavigation(item.path)}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <div className="min-h-screen pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-6">
          <div className="max-w-5xl mx-auto p-4 space-y-4">
            {!requiresWallet || isCustomerConnected ? (
              children
            ) : (
              <div className="max-w-2xl mx-auto mt-8">
                <Card>
                  <CardContent className="py-6">
                    <div className="text-center space-y-4">
                      <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto" />
                      <h2 className="text-xl font-semibold">
                        Customer Access Required
                      </h2>
                      <p className="text-muted-foreground">
                        Please connect your customer wallet using the button
                        above to access the cart and checkout functions.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="flex items-center h-16">
          {navItems.map((item) => (
            <MobileNavButton
              key={item.value}
              item={item}
              isActive={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
