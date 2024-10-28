import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BlockboltLogo } from 'svgIcon';
import { BlockboltStoreUrl, BlockboltUrl } from 'utils/helper';
import WConnectComponent from '../WConnectComponent';
import WAmountComponent from '../WAmountComponent';
import { CustomSigner } from './constant';

const WormholeComponent = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [transferStatus, setTransferStatus] = useState<string[]>([]);
    const [customSigner, setCustomSigner] = useState<CustomSigner | null>(null);

    const onRedirectUrl = () => {
        window.open(BlockboltUrl)
    }

    const renderConnectComponent = () => (
        <WConnectComponent
            setCustomSigner={setCustomSigner}
            setTransferStatus={setTransferStatus}
            transferStatus={transferStatus}
            setWalletAddress={setWalletAddress}
        />
    );

    const renderAmountComponent = () => (
        <WAmountComponent
            walletAddress={walletAddress}
            customSigner={customSigner}
            transferStatus={transferStatus}
            setTransferStatus={setTransferStatus}
        />
    );

    return (
        <>
            <div className="text-center mt-5"><BlockboltLogo /></div>
            <div className='contentWrapper'>
                <h2 className="text-center text-primary mt-5 mb-4">CROSS CHAIN TRANSFER</h2>
                <h5 className="text-center text-muted mb-4">Base Sepolia to ArbitrumSepolia</h5>
                {walletAddress ? renderAmountComponent() : renderConnectComponent()}
            </div>
            <div>
                <p className="text-center">Powered by Wormhole & Circle. <br /> We have integrated this flow on BlockBolt Checkout. Please review at <a href={BlockboltStoreUrl} target='_blank'>{BlockboltStoreUrl}</a></p>
                <p className='text-center'>Developed by BlockBolt <br /> <span className='cursor-pointer' onClick={() => onRedirectUrl()}>www.blockbolt.io</span></p>
            </div>
        </>
    )
}

export default WormholeComponent