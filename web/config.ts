import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { blockdagPrimordial } from "./constants/networks";

export const config = createConfig({
    chains: [sepolia, blockdagPrimordial],
    storage: null,
    transports: {
        [sepolia.id]: http(),
        [blockdagPrimordial.id]: http(),
    },
});

// Helper to get chain by ID
export function getChainById(chainId: number) {
    switch (chainId) {
        case sepolia.id:
            return sepolia;
        case blockdagPrimordial.id:
            return blockdagPrimordial;
        default:
            return undefined;
    }
}

// Helper to check if a chain is supported
export function isSupportedChain(chainId: number) {
    return chainId === sepolia.id || chainId === blockdagPrimordial.id;
}
