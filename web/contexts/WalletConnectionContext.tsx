"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useAccount, useDisconnect } from "wagmi";

interface WalletConnectionState {
  customerConnectedAddress: string | null;
  adminConnectedAddress: string | null;
  connectCustomer: (address: string) => void;
  connectAdmin: (address: string) => void;
  disconnectCustomer: () => void;
  disconnectAdmin: () => void;
  disconnectAll: () => void;
}

const WalletConnectionContext = createContext<
  WalletConnectionState | undefined
>(undefined);

export const WalletConnectionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [customerConnectedAddress, setCustomerConnectedAddress] = useState<
    string | null
  >(null);
  const [adminConnectedAddress, setAdminConnectedAddress] = useState<
    string | null
  >(null);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  // Effect to sync with wallet state
  useEffect(() => {
    if (isConnected && address) {
      // If the address matches either stored address, keep it
      if (
        address === customerConnectedAddress ||
        address === adminConnectedAddress
      ) {
        return;
      }
      // Otherwise, treat it as a customer connection by default
      setCustomerConnectedAddress(address);
    }
  }, [isConnected, address, customerConnectedAddress, adminConnectedAddress]);

  // Effect to handle global wallet disconnection
  useEffect(() => {
    if (!isConnected) {
      // Only clear the context that matches the disconnected address
      setCustomerConnectedAddress((prev) => (prev === address ? null : prev));
      setAdminConnectedAddress((prev) => (prev === address ? null : prev));
    }
  }, [isConnected, address]);

  const connectCustomer = useCallback((addr: string) => {
    setCustomerConnectedAddress(addr);
  }, []);

  const connectAdmin = useCallback((addr: string) => {
    setAdminConnectedAddress(addr);
  }, []);

  const disconnectCustomer = useCallback(() => {
    setCustomerConnectedAddress(null);
  }, []);

  const disconnectAdmin = useCallback(() => {
    setAdminConnectedAddress(null);
  }, []);

  const disconnectAll = useCallback(() => {
    disconnect();
    setCustomerConnectedAddress(null);
    setAdminConnectedAddress(null);
  }, [disconnect]);

  const value = {
    customerConnectedAddress,
    adminConnectedAddress,
    connectCustomer,
    connectAdmin,
    disconnectCustomer,
    disconnectAdmin,
    disconnectAll,
  };

  return (
    <WalletConnectionContext.Provider value={value}>
      {children}
    </WalletConnectionContext.Provider>
  );
};

export const useWalletConnection = () => {
  const context = useContext(WalletConnectionContext);
  if (context === undefined) {
    throw new Error(
      "useWalletConnection must be used within a WalletConnectionProvider",
    );
  }
  return context;
};
