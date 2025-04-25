"use client";

import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LayoutGrid,
  BarChart2,
  FileText,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { Card, CardContent } from "@/components/ui/card";
import { NetworkSelector } from "@/components/network-selector";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { adminConnectedAddress } = useWalletConnection();
  const isAdminConnected = !!adminConnectedAddress;

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
      name: "Receipts",
      path: "/admin/receipts",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Invoices",
      path: "/admin/invoices",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
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
            <h1 className="text-xl font-bold">EquiProtocol</h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive(item.path) ? "bg-blue-50 text-blue-600" : ""}`}
                  onClick={() => navigateTo(item.path)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Button>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Artisan Crafts</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b w-full">
        <div className="flex items-center">
          <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
            <span className="text-white text-lg">🏇</span>
          </div>
          <h1 className="text-lg font-bold">EquiProtocol</h1>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                      <span className="text-white text-lg">🏇</span>
                    </div>
                    <h1 className="text-lg font-bold">EquiProtocol</h1>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="space-y-1 px-2">
                  {menuItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={`w-full justify-start ${isActive(item.path) ? "bg-blue-50 text-blue-600" : ""}`}
                      onClick={() => navigateTo(item.path)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Artisan Crafts</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start mt-4 text-red-600"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-4">
              {!isAdminConnected && (
                <div className="flex items-center text-yellow-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Admin wallet not connected</span>
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {isAdminConnected ? (
            children
          ) : (
            <div className="max-w-2xl mx-auto mt-8">
              <Card>
                <CardContent className="py-6">
                  <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto" />
                    <h2 className="text-xl font-semibold">
                      Admin Access Required
                    </h2>
                    <p className="text-muted-foreground">
                      Please connect your admin wallet using the button in the
                      top right to access the admin section. This ensures secure
                      access to administrative functions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
