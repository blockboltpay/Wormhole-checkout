import React, { useState } from 'react'
import { ToastContainer } from "react-toastify";
import { ProgressBar, Spinner } from 'react-bootstrap';
import { Wormhole, routes, wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import { toastMessage } from 'utils/helper';
import TextboxComponent from 'components/FormsComponent/TextboxComponent';
import ButtonComponent from 'components/FormsComponent/ButtonComponent';
import ModalComponent from 'components/FormsComponent/ModalComponent';

const WAmountComponent = ({ walletAddress, customSigner, transferStatus, setTransferStatus }: any) => {
    const [amount, setAmount] = useState<string>('1.05');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const onModalClose = () => {
        setIsProcessing(false);
        setShowModal(false);
    }

    const initiateTransfer = async () => {
        const ethReceiverAddress = Wormhole.chainAddress('ArbitrumSepolia', process.env.REACT_APP_ARBITRUM_RECEIVER_ADDRESS as string);

        if (!customSigner) {
            setTransferStatus(['Please connect your wallet first.']);
            return;
        }

        setShowModal(true);
        setIsProcessing(true);
        setProgress(0);
        setTransferStatus(['Processing...']);

        try {
            const wh = await wormhole('Testnet', [evm]);
            const sendChain = await wh.getChain('BaseSepolia');
            const destChain = await wh.getChain('ArbitrumSepolia');

            const resolver = wh.resolver([routes.AutomaticTokenBridgeRoute, routes.AutomaticCCTPRoute]);

            const sendToken = Wormhole.tokenId(sendChain.chain, process.env.REACT_APP_BASE_USDC_TOKEN_ADDRESS as string);
            setTransferStatus((prev: any) => [...prev, 'USDC token identified on BaseSepolia']);
            setProgress(25);

            const destTokens = await resolver.supportedDestinationTokens(sendToken, sendChain, destChain);
            let destinationToken = destTokens.find(token => token.address.toString() === process.env.REACT_APP_ARBITRUM_USDC_TOKEN_ADDRESS as string);
            setTransferStatus((prev: any) => [...prev, 'USDC token identified on ArbitrumSepolia']);
            setProgress(50);

            if (!destinationToken) throw new Error("USDC not found on destination chain.");

            const tr = await routes.RouteTransferRequest.create(wh, {
                source: sendToken,
                destination: destinationToken,
            });

            const foundRoutes = await resolver.findRoutes(tr);
            const bestRoute = foundRoutes[0];
            setTransferStatus((prev: any) => [...prev, 'Route for transfer found']);
            setProgress(75);

            const transferParams = {
                amount,
                options: { nativeGas: 0, from: walletAddress, to: ethReceiverAddress }
            };

            const validated = await bestRoute.validate(tr, transferParams);
            if (!validated.valid) throw validated.error;

            const quote = await bestRoute.quote(tr, validated.params);
            if (!quote.success) throw quote.error;

            setTransferStatus((prev: any) => [...prev, 'Approving Transaction...']);
            setProgress(85);
            const receipt = await bestRoute.initiate(tr, customSigner, quote, ethReceiverAddress) as any;
            const getlength = receipt.originTxs.length;
            const secondTxid = receipt.originTxs[getlength - 1].txid;
            setTransferStatus((prev: any) => [
                ...prev, `Transfer completed successfully. You can view it here: https://wormholescan.io/#/tx/${secondTxid}?network=Testnet`
            ]);
            setProgress(100);
        } catch (error: any) {
            error && error.message && toastMessage(error.message);
            onModalClose();
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <>
            <ToastContainer />
            <div className="text-center">
                <p><strong>Connected to:</strong> {walletAddress}</p>
                <TextboxComponent
                    type="number"
                    className={"mb-3"}
                    placeholder="Amount to send"
                    disabled={isProcessing}
                    value={amount}
                    onChange={(e: any) => setAmount(e.target.value)}
                />
                <br />
                <ButtonComponent
                    variantType={"success"}
                    sizeName={"lg"}
                    onClick={initiateTransfer}
                    disabled={isProcessing}
                    btnText={isProcessing ? 'Processing...' : 'Initiate Transfer'}
                />
            </div>
            <ModalComponent
                show={showModal}
                sizeType={"xl"}
                backdropValue={false}
                isCenterd={true}
                onHide={() => onModalClose()}
                modalTitle={"Transfer Progress"}
                bodyContent={
                    <>
                        {isProcessing ? (
                            <div className="text-center mb-3">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : null}
                        <ProgressBar now={progress} animated className="mb-3" />
                        <ul className="list-unstyled">
                            {transferStatus.map((status: any, index: any) => (
                                <li key={index} className='mb-2'>{status}</li>
                            ))}
                        </ul>
                    </>
                }
                footerContent={
                    <ButtonComponent
                        variantType={"secondary"}
                        onClick={() => setShowModal(false)}
                        disabled={isProcessing}
                        btnText={"Close"}
                    />
                }
            />
        </>
    )
}

export default WAmountComponent