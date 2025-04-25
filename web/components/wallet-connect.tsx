"use client";

import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useWalletConnection } from "@/contexts/WalletConnectionContext";
import { InterfaceContext } from "./mode-toggle"; // Import the context type

interface WalletConnectProps {
  context: InterfaceContext; // Receive context from parent
  onConnect?: () => void;
  className?: string;
}

export function WalletConnect({
  context,
  onConnect,
  className,
}: WalletConnectProps) {
  const { connectAsync } = useConnect();
  const { toast } = useToast();

  // Contextual connection state
  const {
    customerConnectedAddress,
    adminConnectedAddress,
    connectCustomer,
    connectAdmin,
    disconnectCustomer,
    disconnectAdmin,
  } = useWalletConnection();

  // Determine connection status for the *current* context
  const isConnectedInContext =
    context === "pos" ? !!customerConnectedAddress : !!adminConnectedAddress;
  const connectedAddressInContext =
    context === "pos" ? customerConnectedAddress : adminConnectedAddress;

  const handleConnect = async () => {
    try {
      // Use wagmi to connect globally
      const connectionResult = await connectAsync({ connector: injected() });
      const connectedAddr = connectionResult.accounts[0];

      // Update the *specific* context based on the prop
      if (context === "pos") {
        connectCustomer(connectedAddr);
      } else {
        connectAdmin(connectedAddr);
      }

      onConnect?.();
      toast({
        title: "Success",
        description: `Wallet connected for ${context === "pos" ? "customer" : "admin"} context.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to connect wallet: " + (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    // Use context-specific disconnect
    if (context === "pos") {
      disconnectCustomer();
    } else {
      disconnectAdmin();
    }
    toast({
      title: "Disconnected",
      description: `${context === "pos" ? "Customer" : "Admin"} wallet disconnected.`,
    });
  };

  return (
    <Button
      onClick={isConnectedInContext ? handleDisconnect : handleConnect}
      // Disable connect button if *globally* connected but not in *this* context?
      // Or allow clicking connect to "switch" context?
      // Current: Button shows connect/disconnect based on *contextual* status.
      // disabled={isGloballyConnected && !isConnectedInContext} // Optional: Prevent connect if globally connected elsewhere
      className={className}
      variant={isConnectedInContext ? "outline" : "default"}
    >
      {isConnectedInContext
        ? `${connectedAddressInContext?.slice(0, 6)}...${connectedAddressInContext?.slice(-4)}`
        : "Connect Wallet"}
    </Button>
  );
}
