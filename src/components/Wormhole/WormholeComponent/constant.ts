import { JsonRpcSigner, isAddress } from 'ethers';

// Custom signer class
export class CustomSigner {
    private signer: JsonRpcSigner;
    private chainName: "BaseSepolia" | "ArbitrumSepolia";
    private addressValue: string;

    constructor(signer: JsonRpcSigner, chainName: "BaseSepolia" | "ArbitrumSepolia", address: string) {
        this.signer = signer;
        this.chainName = chainName;
        this.addressValue = address;
    }

    chain() {
        return this.chainName; // Strict type matching Wormhole's expected types
    }

    address() {
        return this.addressValue;
    }

    async signAndSend(transactions: any[]): Promise<string[]> {
        const results: string[] = [];
        for (const tx of transactions) {
            const transaction = tx.transaction;
            if (!transaction.to || !isAddress(transaction.to)) throw new Error(`Invalid 'to' address: ${transaction.to}`);
            const txResponse = await this.signer.sendTransaction(transaction);
            const receipt = await txResponse.wait();
            if (!receipt) throw new Error("Transaction failed");
            results.push(receipt.hash);
        }
        return results;
    }
}
