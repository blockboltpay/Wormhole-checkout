import { JsonRpcSigner, isAddress } from 'ethers';
// Custom signer class
export class CustomSigner {
    private signer: JsonRpcSigner;
    private chainName: string;
    private addressValue: string;
    private readonly chainId: number;

    constructor(signer: JsonRpcSigner, chainName: string, address: string, chainId: number) {
        this.signer = signer;
        this.chainName = chainName;
        this.addressValue = address;
        this.chainId = chainId;
    }

    chain() {
        return this.chainName as "BaseSepolia" | "ArbitrumSepolia" | "Ethereum" | "Avalanche" | "Polygon" | "Solana" | "Sui" | "Terra" | "Bsc" | "Oasis" | "Algorand" | "Aurora" | "Fantom" | "Karura" | "Acala" | "Klaytn" | "PolygonSepolia";
    }

    address() {
        return this.addressValue;
    }

    private async prepareTransaction(tx: any): Promise<any> {
        const provider = this.signer.provider;
        const feeData = await provider.getFeeData();
        const network = await provider.getNetwork();

        // Default gas limit with buffer
        const estimatedGas = await provider.estimateGas(tx);
        const gasLimit = estimatedGas * BigInt(13) / BigInt(10); // 1.3x buffer

        let preparedTx = {
            ...tx,
            chainId: this.chainId
        };

        // Network specific configurations
        switch (this.chainId) {
            case 421614: // Arbitrum Sepolia
                preparedTx = {
                    ...preparedTx,
                    gasLimit,
                    maxFeePerGas: feeData.maxFeePerGas,
                    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
                };
                break;
            case 11155420: // OP Sepolia
                preparedTx = {
                    ...preparedTx,
                    gasLimit: gasLimit * BigInt(2), // Double gas limit for OP
                };
                break;
            default:
                preparedTx = {
                    ...preparedTx,
                    gasLimit,
                };
        }

        return preparedTx;
    }

    async signAndSend(transactions: any[]): Promise<string[]> {
        const results: string[] = [];
        for (const tx of transactions) {
            try {
                const transaction = tx.transaction;
                if (!transaction.to || !isAddress(transaction.to)) {
                    throw new Error(`Invalid 'to' address: ${transaction.to}`);
                }

                // Prepare transaction with appropriate gas settings
                const preparedTx = await this.prepareTransaction(transaction);

                // Send with retry mechanism
                let retryCount = 0;
                const maxRetries = 3;
                let lastError;

                while (retryCount < maxRetries) {
                    try {
                        const txResponse = await this.signer.sendTransaction(preparedTx);
                        const receipt = await txResponse.wait();

                        if (!receipt) {
                            throw new Error("Transaction failed");
                        }

                        results.push(receipt.hash);
                        break; // Success, exit retry loop
                    } catch (error: any) {
                        lastError = error;
                        retryCount++;

                        if (error?.code === -32603 || error?.message?.includes('JSON-RPC error')) {
                            // Wait before retry with exponential backoff
                            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
                            continue;
                        }
                        throw error; // Rethrow if it's not a retryable error
                    }
                }

                if (retryCount === maxRetries) {
                    throw lastError;
                }
            } catch (error) {
                console.error('Transaction failed:', error);
                throw error;
            }
        }
        return results;
    }
}

export const returnDestName = (getChainName: any) => {
    switch (getChainName) {
        case "BaseSepolia":
            return "ArbitrumSepolia";
        default:
            return "BaseSepolia";
    }
};

export const defaultSourceName = "BaseSepolia";
export const defaultDestinationName = "ArbitrumSepolia";

export const unsupportedChains = ["AvalancheFuji", "Eth Sepolia", "OP Sepolia"];
export const COMING_SOON_NETWORKS = {
    source: ["AvalancheFuji", "Eth Sepolia", "OP Sepolia"],
    dest: ["SolanaDevnet", "SuiTestnet"]
};

export const sourceNetworks = [
    { name: 'BaseSepolia', chainId: 84532, usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', wormholeName: 'BaseSepolia', rpcUrl: 'https://sepolia.base.org' },
    { name: 'ArbitrumSepolia', chainId: 421614, usdcAddress: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', wormholeName: 'ArbitrumSepolia', rpcUrl: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public' },
    { name: 'AvalancheFuji', chainId: 43113, usdcAddress: '0x5425890298aed601595a70ab815c96711a31bc65', wormholeName: 'Avalanche', rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc' },
    { name: 'Eth Sepolia', chainId: 11155111, usdcAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', wormholeName: 'Sepolia', rpcUrl: 'https://rpc.sepolia.org' },
    { name: 'OP Sepolia', chainId: 11155420, usdcAddress: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7', wormholeName: 'OptimismSepolia', rpcUrl: 'https://endpoints.omniatech.io/v1/op/sepolia/public' },
];

export const destNetworks = [
    ...sourceNetworks,
    {
        name: 'SolanaDevnet',
        chainId: null,
        usdcAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
        wormholeName: 'Solana',
        rpcUrl: 'https://api.devnet.solana.com'
    },
    {
        name: 'SuiTestnet',
        chainId: null,
        usdcAddress: '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC',
        wormholeName: 'Sui',
        rpcUrl: 'https://fullnode.testnet.sui.io'
    },
];