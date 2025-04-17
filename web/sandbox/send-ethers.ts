import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const ETHEREUM_SEPOLIA_USDC_ADDRESS =
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

// 1. Input the Sepolia RPC endpoint
const rpcEndpoint = process.env.SEPOLIA_RPC_ENDPOINT;

if (!rpcEndpoint) {
    throw new Error("SEPOLIA_RPC_ENDPOINT environment variable is not set");
}

// 2. Initialize the Ethers.js provider
const provider = new ethers.JsonRpcProvider(rpcEndpoint);

// 3. Input USDC token contract address for Ethereum Sepolia
const tokenAddress = ETHEREUM_SEPOLIA_USDC_ADDRESS;

// 4. Define the USDC token contract ABI
const minTokenAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
];

// 5. Create a new contract instance
interface USDCContract extends ethers.BaseContract {
    transfer(
        to: string,
        value: bigint,
    ): Promise<ethers.ContractTransactionResponse>;
    balanceOf(account: string): Promise<bigint>;
    decimals(): Promise<number>;
}

const contract = new ethers.Contract(
    tokenAddress,
    minTokenAbi,
    provider,
) as unknown as USDCContract;

// 6. Input the addresses and the private key; specify number of tokens to send
const senderAddress = process.env.SENDER_ADDRESS;
const recipientAddress = process.env.RECIPIENT_ADDRESS;
const senderPrivateKey = process.env.SENDER_PRIVATE_KEY;

if (!senderAddress) {
    throw new Error("SENDER_ADDRESS environment variable is not set");
}

if (!recipientAddress) {
    throw new Error("RECIPIENT_ADDRESS environment variable is not set");
}

if (!senderPrivateKey) {
    throw new Error("SENDER_PRIVATE_KEY environment variable is not set");
}

// After null checks, we can safely assert these are strings
const validSenderAddress: string = senderAddress;
const validRecipientAddress: string = recipientAddress;
const validSenderPrivateKey: string = senderPrivateKey;

const usdcAmount = 1.0;

async function main() {
    // 7. Check the number of decimals for the USDC token
    const decimals = await contract.decimals();
    console.log("USDC token decimals:", decimals);

    // 8. Check the balance of the sender address
    const balance = await contract.balanceOf(validSenderAddress);
    console.log("USDC balance:", ethers.formatUnits(balance, decimals));

    // 9. Calculate the actual amount in the smallest unit
    const value = ethers.parseUnits(usdcAmount.toString(), decimals);

    // 10. Create the transaction
    const tx = await (contract.connect(
        new ethers.Wallet(validSenderPrivateKey, provider),
    ) as unknown as USDCContract).transfer(validRecipientAddress, value);

    // 11. Wait for the transaction to be mined and log the transaction hash
    const receipt = await tx.wait();
    console.log("Tx hash:", receipt);
}

main().catch((error) => console.error("Error:", error));
