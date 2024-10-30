import React, { useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import ButtonComponent from 'components/FormsComponent/ButtonComponent';
import { CustomSigner, returnDestName, sourceNetworks, unsupportedChains } from '../WormholeComponent/constant';

const WConnectComponent = ({
    sourceChain,
    destChain,
    walletAddress,
    setWalletAddress,
    setTransferStatus,
    setCustomSigner,
    setDestChain
}: any) => {

    const connectWallet = async (chainName: string) => {
        const selectedNetwork = sourceNetworks.find(net => net.name === chainName);
        if (!selectedNetwork) {
            setTransferStatus(['Invalid network selected.']);
            return;
        }

        if ((window as any).ethereum) {
            try {
                const chainIdHex = `0x${selectedNetwork.chainId?.toString(16)}`;

                await (window as any).ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainIdHex }],
                }).catch(async (switchError: any) => {
                    if (switchError.code === 4902) {
                        await (window as any).ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: chainIdHex,
                                    chainName: selectedNetwork.name,
                                    rpcUrls: [selectedNetwork.rpcUrl],
                                    nativeCurrency: {
                                        name: 'Testnet ETH',
                                        symbol: 'tETH',
                                        decimals: 18,
                                    },
                                    blockExplorerUrls: [],
                                },
                            ],
                        });
                    } else {
                        throw switchError;
                    }
                });

                const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                const address = accounts[0];
                setWalletAddress(address);

                const provider = new BrowserProvider((window as any).ethereum);
                const signer = await provider.getSigner();

                // Use the selectedNetwork's chainId instead of hardcoded value
                const newCustomSigner = new CustomSigner(
                    signer,
                    chainName,
                    address,
                    selectedNetwork.chainId || 0  // Use the actual chain ID from the network
                );

                setCustomSigner(newCustomSigner);
                setTransferStatus([`Wallet connected to ${chainName} successfully`]);
            } catch (err) {
                console.error('Failed to connect wallet', err);
                setTransferStatus((prev: any) => [...prev, 'Failed to connect wallet']);
            }
        } else {
            alert('MetaMask or compatible wallet not found. Please install it.');
        }
    };

    useEffect(() => {
        const getDesChainName = returnDestName(sourceChain);
        setDestChain(getDesChainName);
        if (!unsupportedChains.includes(sourceChain)) {
            walletAddress && connectWallet(sourceChain);
        }
    }, [sourceChain]);

    console.log('destChain connect', destChain);


    return (
        <div className="text-center">
            <ButtonComponent
                variant="primary"
                size="lg"
                onClick={() => connectWallet(sourceChain)}
                btnText={"Connect Wallet"}
            />
        </div>
    )
}

export default WConnectComponent