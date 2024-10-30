import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BlockboltLogo } from 'svgIcon';
import { BlockboltStoreUrl, BlockboltUrl } from 'utils/helper';
import WSelectionComponent from '../WSelectionComponent';
import WTransferComponent from '../WTransferComponent';
import WConnectComponent from '../WConnectComponent';
import { CustomSigner, defaultDestinationName, defaultSourceName } from './constant';

const WormholeComponent = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [transferStatus, setTransferStatus] = useState<string[]>([]);
    const [customSigner, setCustomSigner] = useState<CustomSigner | null>(null);
    const [sourceChain, setSourceChain] = useState<string>(defaultSourceName);
    const [destChain, setDestChain] = useState<string>(defaultDestinationName);

    const renderTransferComponent = () => (
        <WTransferComponent
            sourceChain={sourceChain}
            destChain={destChain}
            walletAddress={walletAddress}
            customSigner={customSigner}
            transferStatus={transferStatus}
            setTransferStatus={setTransferStatus}
        />
    );

    const renderConnectComponent = () => (
        <WConnectComponent
            sourceChain={sourceChain}
            destChain={destChain}
            walletAddress={walletAddress}
            setWalletAddress={setWalletAddress}
            setTransferStatus={setTransferStatus}
            setCustomSigner={setCustomSigner}
            setDestChain={setDestChain}
        />
    );

    return (
        <div>
            <div className="text-center mt-5 mb-4"><BlockboltLogo /></div>
            <div className='containerWrapper'>
                <div className="container containbg">
                    <h2 className="text-center text-primary mb-4">CROSS CHAIN TRANSFER</h2>
                    <h5 className="text-center text-muted mb-4">Select Source and Destination Chains</h5>
                    <WSelectionComponent
                        sourceChain={sourceChain}
                        destChain={destChain}
                        setDestChain={setDestChain}
                        setSourceChain={setSourceChain}
                    />
                    {walletAddress ? renderTransferComponent() : renderConnectComponent()}
                </div>
            </div>
            <div>
                <h5 className="text-center text-muted">Powered by Wormhole & Circle. <br /> We have integrated this flow on BlockBolt Checkout. Please review at <a href={BlockboltStoreUrl} target='_blank'>{BlockboltStoreUrl}</a></h5>
                <p className='text-center mt-4'>Developed by BlockBolt <br /><a href={BlockboltUrl} target='_blank'>www.blockbolt.io</a></p>
            </div>
        </div>
    )
}

export default WormholeComponent