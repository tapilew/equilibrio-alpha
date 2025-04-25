"use client";

import { useCallback } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { metaMask } from "wagmi/connectors";

export function WalletConnectButton() {
  const { connect, status } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const handleConnect = useCallback(() => {
    connect({ connector: metaMask() });
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  // Common button styles
  const commonButtonProps = {
    size: "sm" as const,
    className: "min-w-[140px] justify-center",
  };

  if (status === "pending") {
    return (
      <Button disabled {...commonButtonProps}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isConnected) {
    return (
      <Button
        onClick={handleDisconnect}
        variant="outline"
        {...commonButtonProps}
      >
        <Wallet className="h-4 w-4 mr-2" />
        Disconnect
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} {...commonButtonProps}>
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
