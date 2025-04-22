"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useTransaction,
  useBalance,
  useSimulateContract,
  useWatchContractEvent,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { parseEther, formatEther } from "viem";
import { abi, contractAddress } from "../../constants/contract";

export default function FundMePage() {
  const [ethAmount, setEthAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Wallet connection
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();

  // Contract balance
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: contractAddress as `0x${string}`,
  });

  // Prepare fund transaction
  const { data: fundSimulation } = useSimulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: "fund",
    value: ethAmount ? parseEther(ethAmount) : undefined,
  });

  // Fund contract
  const { data: fundTx, writeContract: fund } = useContractWrite();

  // Track fund transaction
  const { isLoading: isFunding } = useTransaction({
    hash: fundTx as `0x${string}`,
  });

  useWatchContractEvent({
    address: contractAddress as `0x${string}`,
    abi,
    eventName: "Funded",
    onLogs() {
      refetchBalance();
    },
  });

  // Prepare withdraw transaction
  const { data: withdrawSimulation } = useSimulateContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: "withdraw",
  });

  // Withdraw from contract
  const { data: withdrawTx, writeContract: withdraw } = useContractWrite();

  // Track withdraw transaction
  const { isLoading: isWithdrawing } = useTransaction({
    hash: withdrawTx as `0x${string}`,
  });

  useWatchContractEvent({
    address: contractAddress as `0x${string}`,
    abi,
    eventName: "Withdrawn",
    onLogs() {
      refetchBalance();
    },
  });

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ethAmount || !fund || !fundSimulation?.request) return;

    try {
      await fund(fundSimulation.request);
      setEthAmount("");
    } catch (err) {
      setError("Failed to fund: " + (err as Error).message);
    }
  };

  const handleConnect = async () => {
    try {
      await connectAsync({ connector: injected() });
    } catch (err) {
      setError("Failed to connect: " + (err as Error).message);
    }
  };

  const handleWithdraw = async () => {
    if (!withdraw || !withdrawSimulation?.request) return;

    try {
      await withdraw(withdrawSimulation.request);
    } catch (err) {
      setError("Failed to withdraw: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Fund Me App
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="sr-only">Dismiss</span>
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              onClick={handleConnect}
              className={`px-4 py-2 rounded-md ${
                isConnected
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={isConnected}
            >
              {isConnected ? "Connected" : "Connect Wallet"}
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contract Balance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {balance ? formatEther(balance.value) : "0"} ETH
              </p>
            </div>
          </div>

          <form onSubmit={handleFund} className="space-y-4">
            <div>
              <label
                htmlFor="ethAmount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                ETH Amount
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="ethAmount"
                  value={ethAmount}
                  onChange={(e) => {
                    // Only allow numbers and decimals
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setEthAmount(value);
                    }
                  }}
                  placeholder="0.1"
                  disabled={!isConnected || isFunding}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!isConnected || !ethAmount || isFunding}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFunding ? "Funding..." : "Fund"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 flex space-x-4">
            <button
              type="button"
              onClick={() => refetchBalance()}
              disabled={!isConnected}
              className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Refresh Balance
            </button>
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={!isConnected || isWithdrawing}
              className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWithdrawing ? "Withdrawing..." : "Withdraw"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
