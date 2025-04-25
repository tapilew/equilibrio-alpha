import { type Chain } from "@wagmi/core";

// Custom BlockDAG chain configuration
export const blockdagPrimordial = {
    id: 1337,
    name: "BlockDAG Primordial",
    network: "blockdag-primordial",
    nativeCurrency: {
        decimals: 18,
        name: "BlockDAG",
        symbol: "BDAG",
    },
    rpcUrls: {
        default: {
            http: ["http://localhost:8545"], // This will be updated with actual BlockDAG RPC URL
        },
        public: {
            http: ["http://localhost:8545"], // This will be updated with actual BlockDAG RPC URL
        },
    },
    blockExplorers: {
        default: {
            name: "BlockDAG Explorer",
            url: "https://explorer.blockdag.network", // This will be updated with actual explorer URL
        },
    },
    testnet: true,
} as const satisfies Chain;

// Network type for UI
export type NetworkType = "sepolia" | "blockdag-primordial" | "celo-alfajores";

// Network display information
export const NETWORK_DETAILS = {
    sepolia: {
        name: "Sepolia Testnet",
        displayName: "Sepolia",
        icon: "🌐",
        isTestnet: true,
        isEnabled: true,
    },
    "blockdag-primordial": {
        name: "BlockDAG Primordial",
        displayName: "BlockDAG Primordial",
        icon: "🏇",
        isTestnet: true,
        isEnabled: true,
    },
    "celo-alfajores": {
        name: "Celo Alfajores Testnet",
        displayName: "Celo Alfajores",
        icon: "🌱",
        isTestnet: true,
        isEnabled: false, // Coming soon
    },
} as const;

// Helper function to get network details
export function getNetworkDetails(network: NetworkType) {
    return NETWORK_DETAILS[network];
}

// Helper to check if a network is enabled
export function isNetworkEnabled(network: string): boolean {
    return network in NETWORK_DETAILS &&
        NETWORK_DETAILS[network as NetworkType].isEnabled;
}

// Helper to validate network type
export function isValidNetwork(network: string): network is NetworkType {
    return network in NETWORK_DETAILS;
}

// Helper to get chain ID for a network
export function getChainIdForNetwork(network: NetworkType): number {
    switch (network) {
        case "sepolia":
            return 11155111;
        case "blockdag-primordial":
            return 1337;
        case "celo-alfajores":
            return 44787;
        default:
            throw new Error(`Chain ID not configured for network ${network}`);
    }
}
