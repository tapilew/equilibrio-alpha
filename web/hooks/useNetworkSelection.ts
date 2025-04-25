import { useCallback, useEffect, useState } from "react";
import { useSwitchChain } from "wagmi";
import {
    getChainIdForNetwork,
    getNetworkDetails,
    isNetworkEnabled,
    isValidNetwork,
    type NetworkType,
} from "@/constants/networks";

const NETWORK_STORAGE_KEY = "selectedNetwork";
const DEFAULT_NETWORK: NetworkType = "blockdag-primordial";

export function useNetworkSelection() {
    // Initialize from localStorage or default
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>(() => {
        if (typeof window === "undefined") return DEFAULT_NETWORK;
        const stored = localStorage.getItem(NETWORK_STORAGE_KEY);
        if (stored && isValidNetwork(stored) && isNetworkEnabled(stored)) {
            return stored;
        }
        return DEFAULT_NETWORK;
    });

    const { switchChain } = useSwitchChain();

    // Persist network selection
    useEffect(() => {
        localStorage.setItem(NETWORK_STORAGE_KEY, selectedNetwork);
    }, [selectedNetwork]);

    const handleNetworkChange = useCallback(async (network: NetworkType) => {
        if (!isNetworkEnabled(network)) {
            console.warn(`Network ${network} is not enabled yet`);
            return false;
        }

        try {
            const chainId = getChainIdForNetwork(network);
            await switchChain({ chainId });
            setSelectedNetwork(network);
            return true;
        } catch (error) {
            console.error("Failed to switch network:", error);
            return false;
        }
    }, [switchChain]);

    return {
        selectedNetwork,
        handleNetworkChange,
        networkDetails: getNetworkDetails(selectedNetwork),
    };
}
