import React from 'react'
import { BrowserProvider } from 'ethers';
import ButtonComponent from 'components/FormsComponent/ButtonComponent';
import { CustomSigner } from '../WormholeComponent/constant';

const WConnectComponent = ({ setCustomSigner, setTransferStatus, transferStatus, setWalletAddress }: any) => {
    const connectWallet = async () => {
        if ((window as any).ethereum) {
            try {
                const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                const address = accounts[0];
                setWalletAddress(address);

                const provider = new BrowserProvider((window as any).ethereum);
                const signer = await provider.getSigner();
                const newCustomSigner = new CustomSigner(signer, 'BaseSepolia', address); // Set chain type here
                setCustomSigner(newCustomSigner);
                setTransferStatus(["Wallet connected successfully"]);
            } catch (err) {
                console.error('Failed to connect wallet', err);
                setTransferStatus([...transferStatus, 'Failed to connect wallet']);
            }
        } else {
            alert('MetaMask or compatible wallet not found. Please install it.');
        }
    };
    return (
        <div className="text-center">
            <ButtonComponent
                variantType={"primary"}
                sizeName={"lg"}
                onClick={connectWallet}
                btnText={"Connect Wallet"}
            />
        </div>
    )
}

export default WConnectComponent