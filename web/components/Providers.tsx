"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { WalletConnectionProvider } from "@/contexts/WalletConnectionContext";
import { config } from "@/config";

// TanStack Query Client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConvexClientProvider>
          <WalletConnectionProvider>{children}</WalletConnectionProvider>
        </ConvexClientProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
