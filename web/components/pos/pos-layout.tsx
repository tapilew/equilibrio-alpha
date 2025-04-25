"use client";

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

interface PosLayoutProps {
  children: React.ReactNode;
}

export function PosLayout({ children }: PosLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { customerConnectedAddress } = useWalletConnection();
  const isCustomerConnected = !!customerConnectedAddress;

  const handleNavigation = (targetPath: string) => {
    router.push(targetPath);
  };

  // Determine if we're in a checkout flow
  const isCheckout =
    pathname.includes("/pos/checkout") || pathname.includes("/pos/payment");

  // Determine if we're in the cart or checkout flow
  const requiresWallet = pathname.includes("/pos/cart") || isCheckout;

  const navItems = [
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
  ];

  // Helper to determine if a path is active
  // Handles base path "/pos" potentially matching only itself
  const isActive = (itemPath: string) => {
    if (itemPath === "/pos") {
      return pathname === "/pos" || pathname === "/pos/";
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 overflow-y-auto">
          <div className="px-4 mb-5">
            <div className="flex items-center flex-shrink-0 mb-4">
              <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <span className="text-white text-xl">🏇</span>
              </div>
              <h1 className="text-xl font-bold">EquiProtocol POS</h1>
            </div>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const itemIsActive = isActive(item.path);
                return (
                  <Button
                    key={item.value}
                    variant={itemIsActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      itemIsActive ? "bg-blue-50 text-blue-600" : "",
                    )}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col w-full md:pl-64">
        {/* Mobile Header */}
        <header className="md:hidden border-b p-4 bg-white flex items-center justify-between">
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

        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-4">
              {!isCustomerConnected && requiresWallet && (
                <div className="flex items-center text-yellow-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Customer wallet not connected</span>
                </div>
              )}
              <div className="h-6 w-px bg-gray-200"></div>
              <NetworkSelector className="w-[180px]" />
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {!requiresWallet || isCustomerConnected ? (
            <div className="max-w-5xl mx-auto">{children}</div>
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
                      Please connect your customer wallet using the button in
                      the top right to access the cart and checkout functions.
                      This ensures secure access to payment functions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {/* Bottom Navigation - Only show in mobile and main POS screens */}
        {!isCheckout && (
          <div className="fixed md:hidden bottom-0 left-0 right-0 border-t bg-white">
            <div className="flex justify-around items-center h-16">
              {navItems.map((item) => {
                const Icon = item.icon;
                const itemIsActive = isActive(item.path);
                return (
                  <button
                    key={item.value}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-full",
                      itemIsActive ? "text-blue-600" : "text-gray-500",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs mt-1">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
