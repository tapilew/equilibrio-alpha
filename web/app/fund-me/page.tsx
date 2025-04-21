"use client";

import { useState } from "react";
import { useFundMe } from "../../hooks/useFundMe";

export default function FundMePage() {
  const [ethAmount, setEthAmount] = useState("");
  const { isConnected, balance, error, connect, getBalance, fund, withdraw } =
    useFundMe();

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ethAmount) {
      await fund(ethAmount);
      setEthAmount("");
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
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              onClick={connect}
              className={`px-4 py-2 rounded-md ${
                isConnected
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isConnected ? "Connected" : "Connect Wallet"}
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contract Balance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {balance} ETH
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
                  onChange={(e) => setEthAmount(e.target.value)}
                  placeholder="0.1"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Fund
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 flex space-x-4">
            <button
              type="button"
              onClick={getBalance}
              className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Balance
            </button>
            <button
              type="button"
              onClick={withdraw}
              className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
