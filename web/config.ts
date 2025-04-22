import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const config = createConfig({
    chains: [mainnet, sepolia],
    storage: null,
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
});
