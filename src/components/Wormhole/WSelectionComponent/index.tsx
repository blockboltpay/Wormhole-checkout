import React from 'react';
import DropdownComponent from 'components/FormsComponent/DropdownComponent';
import { COMING_SOON_NETWORKS, destNetworks, sourceNetworks } from '../WormholeComponent/constant';

interface Network {
    name: string;
    chainId: number | null;  // Allow chainId to be null
    usdcAddress: string;
    wormholeName: string;
    rpcUrl: string;
}

interface WSelectionComponentProps {
    sourceChain: string;
    destChain: string;
    setDestChain: (chain: string) => void;
    setSourceChain: (chain: string) => void;
}


const WSelectionComponent: React.FC<WSelectionComponentProps> = ({
    sourceChain,
    destChain,
    setDestChain,
    setSourceChain,
}) => {

    console.log('here', destChain, sourceChain);


    const isComingSoon = (networkName: string, type: 'source' | 'dest') =>
        (type === 'source' ? COMING_SOON_NETWORKS.source : COMING_SOON_NETWORKS.dest).includes(networkName);

    const onSourceClickManage = (selectedChain: string) => {
        if (!isComingSoon(selectedChain, 'source')) {
            setSourceChain(selectedChain);
        }
    };

    const onDestinationClickManage = (selectedChain: string) => {
        if (!isComingSoon(selectedChain, 'dest')) {
            setDestChain(selectedChain);
        }
    };

    const renderNetworkOptions = (networks: Network[], type: 'source' | 'dest') => {
        return networks.map(network => (
            <option key={network.name} value={network.name}>
                {network.name} {isComingSoon(network.name, type) ? "- Coming Soon" : ""}
            </option>
        ));
    };

    return (
        <>
            <DropdownComponent
                extaClass="mb-3"
                label="Source Chain"
                asType="select"
                value={sourceChain}
                onChange={(e: any) => onSourceClickManage(e.target.value)}
                renderContent={renderNetworkOptions(sourceNetworks, 'source')}
            />
            <DropdownComponent
                extaClass="mb-3"
                label="Destination Chain"
                asType="select"
                value={destChain}
                onChange={(e: any) => onDestinationClickManage(e.target.value)}
                renderContent={renderNetworkOptions(destNetworks.filter(network => network.name !== sourceChain), 'dest')}
            />
        </>
    );
};

export default WSelectionComponent;
