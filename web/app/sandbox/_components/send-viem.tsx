"use client";

import React, { useEffect, useState } from "react";
import {
  http,
  type Address,
  type Hash,
  type TransactionReceipt,
  createPublicClient,
  createWalletClient,
  custom,
  stringify,
  encodeFunctionData,
  type WalletClient,
} from "viem";
import { sepolia } from "viem/chains";
import "viem/window";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

// Remove the direct wallet client initialization that uses window
// const walletClient = createWalletClient({
// 	chain: sepolia,
// 	transport: custom(window.ethereum!),
// });

const USDC_CONTRACT_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const USDC_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

export function ExampleViemSendUSDC() {
  const [account, setAccount] = useState<Address>();
  const [hash, setHash] = useState<Hash>();
  const [receipt, setReceipt] = useState<TransactionReceipt>();
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  const addressInput = React.createRef<HTMLInputElement>();
  const valueInput = React.createRef<HTMLInputElement>();

  // Initialize wallet client on the client side only
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const client = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });
      setWalletClient(client);
    }
  }, []);

  const connect = async () => {
    if (!walletClient) return;
    const [address] = await walletClient.requestAddresses();
    setAccount(address);
  };

  const sendTransaction = async () => {
    if (!account || !walletClient) return;

    const toAddress = addressInput.current!.value;
    const value = valueInput.current!.value;

    // Validate inputs
    if (!toAddress || !value) {
      alert("Please enter both address and value");
      return;
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
      alert("Invalid Ethereum address format");
      return;
    }

    const to = toAddress as Address;
    const valueInWei = BigInt(value) * BigInt(10 ** 6); // Assuming USDC has 6 decimals

    const data = encodeFunctionData({
      abi: USDC_ABI,
      functionName: "transfer",
      args: [to, valueInWei],
    });

    const hash = await walletClient.sendTransaction({
      account,
      to: USDC_CONTRACT_ADDRESS,
      data,
      chain: sepolia,
    });
    setHash(hash);
  };

  useEffect(() => {
    (async () => {
      if (hash) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        setReceipt(receipt);
      }
    })();
  }, [hash]);

  if (account) {
    return (
      <>
        <div>Connected: {account}</div>
        <input ref={addressInput} placeholder="address" />
        <input ref={valueInput} placeholder="value (USDC)" />
        <button onClick={sendTransaction}>Send</button>
        {receipt && (
          <div>
            Receipt:{" "}
            <pre>
              <code>{stringify(receipt, null, 2)}</code>
            </pre>
          </div>
        )}
      </>
    );
  }
  return <button onClick={connect}>Connect Wallet</button>;
}
