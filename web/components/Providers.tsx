"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import ConvexClientProvider from "@/components/ConvexClientProvider";

// TanStack Query Client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize config in state to ensure it's client-side only
  const [config] = useState(() =>
    createConfig({
      chains: [mainnet, sepolia],
      storage: null,
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      },
    }),
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
