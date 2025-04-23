"use client";

import type React from "react";

import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { ShoppingCart, Home, Receipt, ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PosLayoutProps {
  children: React.ReactNode;
}

export function PosLayout({ children }: PosLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("catalog");

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case "catalog":
        router.push("/pos");
        break;
      case "cart":
        router.push("/pos/cart");
        break;
      case "receipts":
        router.push("/pos/receipts");
        break;
      default:
        router.push("/pos");
        break;
    }
  };

  // Determine if we're in a checkout flow
  const isCheckout =
    pathname.includes("/pos/checkout") || pathname.includes("/pos/payment");

  const navItems = [
    {
      name: "Catalog",
      icon: Home,
      value: "catalog",
    },
    {
      name: "Cart",
      icon: ShoppingCart,
      value: "cart",
    },
    {
      name: "Receipts",
      icon: Receipt,
      value: "receipts",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <span className="text-white text-xl">🏇</span>
            </div>
            <h1 className="text-xl font-bold">EquiProtocol POS</h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.value}
                    variant={activeTab === item.value ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      activeTab === item.value
                        ? "bg-blue-50 text-blue-600"
                        : "",
                    )}
                    onClick={() => handleNavigation(item.value)}
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
        <header className="md:hidden border-b p-4 bg-white flex items-center">
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
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>

        {/* Bottom Navigation - Only show in mobile and main POS screens */}
        {!isCheckout && (
          <div className="fixed md:hidden bottom-0 left-0 right-0 border-t bg-white">
            <div className="flex justify-around items-center h-16">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    onClick={() => handleNavigation(item.value)}
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-full",
                      activeTab === item.value
                        ? "text-blue-600"
                        : "text-gray-500",
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

      {/* Mode Toggle */}
      <ModeToggle />
    </div>
  );
}
