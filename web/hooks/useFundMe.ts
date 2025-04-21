import { useCallback, useState } from "react";
import { ethers } from "ethers";
import { abi, contractAddress } from "../constants/contract";

export function useFundMe() {
    const [isConnected, setIsConnected] = useState(false);
    const [balance, setBalance] = useState<string>("0");
    const [error, setError] = useState<string | null>(null);

    const connect = useCallback(async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setIsConnected(true);
            } catch (error) {
                setError("Failed to connect wallet");
                console.error(error);
            }
        } else {
            setError("Please install MetaMask");
        }
    }, []);

    const getBalance = useCallback(async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const balance = await provider.getBalance(contractAddress);
                setBalance(ethers.formatEther(balance));
            } catch (error) {
                setError("Failed to get balance");
                console.error(error);
            }
        } else {
            setError("Please install MetaMask");
        }
    }, []);

    const fund = useCallback(async (ethAmount: string) => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    abi,
                    signer,
                );

                const transactionResponse = await contract.fund({
                    value: ethers.parseEther(ethAmount),
                });
                await transactionResponse.wait(1);
                await getBalance(); // Refresh balance after funding
            } catch (error) {
                setError("Failed to fund");
                console.error(error);
            }
        } else {
            setError("Please install MetaMask");
        }
    }, [getBalance]);

    const withdraw = useCallback(async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress,
                    abi,
                    signer,
                );

                const transactionResponse = await contract.withdraw();
                await transactionResponse.wait(1);
                await getBalance(); // Refresh balance after withdrawal
            } catch (error) {
                setError("Failed to withdraw");
                console.error(error);
            }
        } else {
            setError("Please install MetaMask");
        }
    }, [getBalance]);

    return {
        isConnected,
        balance,
        error,
        connect,
        getBalance,
        fund,
        withdraw,
    };
}
