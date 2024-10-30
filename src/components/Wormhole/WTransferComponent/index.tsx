import React, { useState } from 'react'
import { ProgressBar, Spinner } from 'react-bootstrap';
import solana from '@wormhole-foundation/sdk/solana';
import evm from '@wormhole-foundation/sdk/evm';
import sui from '@wormhole-foundation/sdk/sui';
import { Wormhole, routes, wormhole } from '@wormhole-foundation/sdk';
import ModalComponent from 'components/FormsComponent/ModalComponent';
import ButtonComponent from 'components/FormsComponent/ButtonComponent';
import TextboxComponent from 'components/FormsComponent/TextboxComponent';
import { destNetworks, sourceNetworks } from '../WormholeComponent/constant';

const WTransferComponent = ({
    sourceChain,
    destChain,
    walletAddress,
    customSigner,
    transferStatus,
    setTransferStatus,
}: any) => {
    const [amount, setAmount] = useState<string>('1.05');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const onCloseProcess = () => {
        setIsProcessing(false);
        setShowModal(false);
    }

    const initiateTransfer = async () => {
        if (!customSigner) {
            setTransferStatus(['Please connect your wallet first.']);
            return;
        }

        const sendNetwork = sourceNetworks.find(net => net.name === sourceChain);
        const destinationNetwork = destNetworks.find(net => net.name === destChain);

        if (!sendNetwork || !destinationNetwork) {
            setTransferStatus(['Invalid source or destination network selected.']);
            return;
        }

        setShowModal(true);
        setIsProcessing(true);
        setProgress(0);
        setTransferStatus(['Processing...']);

        try {
            const wh = await wormhole('Testnet', [evm, solana, sui]);
            const sendChain = await wh.getChain(sendNetwork.wormholeName as any);
            const destChainObj = await wh.getChain(destinationNetwork.wormholeName as any);

            const resolver = wh.resolver([routes.AutomaticTokenBridgeRoute, routes.AutomaticCCTPRoute]);

            const sendToken = Wormhole.tokenId(sendChain.chain, sendNetwork.usdcAddress);
            setTransferStatus((prev: any) => [...prev, `USDC token identified on ${sendNetwork.name}`]);
            setProgress(25);

            const destTokens = await resolver.supportedDestinationTokens(sendToken, sendChain, destChainObj);
            let destinationToken = destTokens.find(token => token.address && token.address.toString().toLowerCase() === destinationNetwork.usdcAddress.toLowerCase());

            if (!destinationToken) {
                throw new Error("USDC not found on destination chain.");
            }

            setTransferStatus((prev: any) => [...prev, `USDC token identified on ${destinationNetwork.name}`]);
            setProgress(50);

            const tr = await routes.RouteTransferRequest.create(wh, {
                source: sendToken,
                destination: destinationToken,
            });

            const foundRoutes = await resolver.findRoutes(tr);
            const bestRoute = foundRoutes[0];
            setTransferStatus((prev: any) => [...prev, 'Route for transfer found']);
            setProgress(75);

            let destinationAddress;
            if (destinationNetwork.wormholeName === 'Solana') {
                destinationAddress = Wormhole.chainAddress('Solana', process.env.REACT_APP_SOL_RECEIVER_ADDRESS as string);
            } else if (destinationNetwork.wormholeName === 'Sui') {
                destinationAddress = Wormhole.chainAddress('Sui', process.env.REACT_APP_SUI_RECEIVER_ADDRESS as string);
            } else {
                destinationAddress = Wormhole.chainAddress(destinationNetwork.wormholeName as
                    "BaseSepolia" | "ArbitrumSepolia" | "Ethereum" | "Avalanche" | "Polygon" | "Bsc" | "Terra" | "Oasis" | "Algorand" | "Aurora" | "Fantom" | "Karura" | "Acala" | "Klaytn",
                    process.env.REACT_APP_EVM_RECEIVER_ADDRESS as string
                );
            }

            const transferParams = {
                amount,
                options: { nativeGas: 0, from: walletAddress, to: destinationAddress },
            };

            const validated = await bestRoute.validate(tr, transferParams);
            if (!validated.valid) throw validated.error;

            const quote = await bestRoute.quote(tr, validated.params);
            if (!quote.success) throw quote.error;

            setTransferStatus((prev: any) => [...prev, 'Approving Transaction...']);
            setProgress(85);

            const receipt = await bestRoute.initiate(tr, customSigner, quote, destinationAddress) as any;
            const getlength = receipt.originTxs.length;
            const secondTxid = receipt.originTxs[getlength - 1].txid;
            setTransferStatus((prev: any) => [
                ...prev,
                `Transfer completed successfully. You can view it here: https://wormholescan.io/#/tx/${secondTxid}?network=Testnet&view=overview`
            ]);
            setProgress(100);
        } catch (error: any) {
            setTransferStatus((prev: any) => [...prev, `Transfer failed: ${error.message}`]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="text-center">
                <p><strong>Connected to:</strong> {walletAddress}</p>
                <TextboxComponent
                    type="number"
                    placeholder="Amount to send"
                    value={amount}
                    disabled={isProcessing}
                    onChange={(e: any) => setAmount(e.target.value)}
                />
                <br />
                <ButtonComponent
                    size="lg"
                    variant="success"
                    extraClass="mt-2"
                    onClick={initiateTransfer}
                    disabled={isProcessing}
                    btnText={isProcessing ? 'Processing...' : 'Initiate Transfer'}
                />
            </div>
            <ModalComponent
                isCenterd={true}
                show={showModal}
                backdropValue={false}
                onHide={() => setShowModal(false)}
                modalTitle={"Transfer Progress"}
                bodyContent={
                    <>
                        {isProcessing ? (
                            <div className="text-center mb-3">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : null}
                        <ProgressBar now={progress} animated className="mb-3" />
                        <ul className="list-unstyled overflow-break">
                            {transferStatus.map((status: any, index: any) => (
                                <li key={index} className='mb-10'>{status}</li>
                            ))}
                        </ul>
                    </>
                }
                footerContent={
                    <ButtonComponent
                        variant="secondary"
                        onClick={() => onCloseProcess()}
                        disabled={isProcessing}
                        btnText={"Close"}
                    />
                }
            />
        </>
    )
}

export default WTransferComponent