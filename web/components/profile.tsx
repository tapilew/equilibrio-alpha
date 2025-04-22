"use client";

import { useAccount, useEnsName } from "wagmi";
import React, { useState, useEffect } from "react";

export function Profile() {
  // State to track client-side mount
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get full account details
  const {
    address,
    isConnecting,
    isConnected,
    status: accountStatus,
  } = useAccount();

  // Get ENS details (only if connected)
  const {
    data: ensName,
    error: ensError,
    status: ensStatus,
  } = useEnsName({
    address,
    query: {
      enabled: isConnected, // Only run ENS query if connected
    },
  });

  // --- Render Logic ---

  // 1. Wait for client mount
  if (!isClient) {
    return <div>Loading profile...</div>;
  }

  // 2. Wait for connection status to be definitive
  if (isConnecting || accountStatus === "reconnecting") {
    return <div>Connecting wallet... (Status: {accountStatus})</div>;
  }

  // 3. Handle disconnected state
  if (!isConnected) {
    return <div>Wallet disconnected. (Status: {accountStatus})</div>;
  }

  // 4. Wallet is connected, show details
  return (
    <div>
      <p>Account Status: {accountStatus}</p>
      <p>Address: {address}</p>
      <div>
        ENS Status: {ensStatus}
        {ensStatus === "pending" && " (Loading...)"}
        {ensStatus === "error" && ` (Error: ${ensError?.message})`}
        {ensStatus === "success" &&
          ` (Name: ${ensName || "No ENS name found"})`}
      </div>
    </div>
  );
}
