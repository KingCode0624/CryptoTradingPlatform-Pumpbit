"use client";

import {
    createContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from 'react';
import {
    getDefaultWallets,
    connectorsForWallets,
    Chain,
    getDefaultConfig
} from "@rainbow-me/rainbowkit";

import {
    tokenPocketWallet,
    bitgetWallet,
    okxWallet,
    rainbowWallet,
    walletConnectWallet,
    metaMaskWallet,
    gateWallet,
    // gateWallet,
} from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import {
    http,
    useAccount,
    useChainId,
} from "wagmi";

import { mainnet, merlin } from "wagmi/chains";
import { Web3ContextType } from '../types';
import { useEthersProvider, useEthersSigner } from '../utils/wagmi-ethers';
import EstokkYamContractAbi from '@/contracts/EstokkYam.json';
import Web3 from 'web3';
import { ethers, Contract, ContractRunner } from 'ethers';
import { b2testnetAddress } from '@/constants';
import { access } from 'fs';

// const projectId = "7e778a0cc9adc4e4434bf73bff51f07c"; //default projectId
const projectId = "57826bfdbc6cd9752e192a296fbbd40d"

const { wallets } = getDefaultWallets({
    appName: "Pumpbit",
    projectId,
});

const bitLayer = {
    id: 200901,
    name: "Bitlayer Mainnet",
    nativeCurrency: {
        name: "BTC",
        symbol: "BTC",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ["https://rpc.bitlayer-rpc.com"] },
    },
};

const b2Network = {
    id: 223,
    name: "B2 Mainnet",
    nativeCurrency: {
        name: "BTC",
        symbol: "BTC",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ["https://rpc.bsquared.network"] },
    },
};

const AllLayer = {
    id: 2649,
    name: "AILayer Mainnet",
    nativeCurrency: {
        name: "BTC",
        symbol: "BTC",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ["https://mainnet-rpc.ailayer.xyz"] },
    },
};

const connectors = connectorsForWallets(
    [
        {
            groupName: "Recommended",
            wallets: [
                tokenPocketWallet,
                bitgetWallet,
                okxWallet,
                rainbowWallet,
                walletConnectWallet,
                metaMaskWallet,
                gateWallet,
            ],
        },
    ],
    {
        appName: "AIStarter",
        projectId: projectId,
    }
);

const chains: readonly [Chain, ...Chain[]] = [
    {
        ...mainnet,
    },
    {
        ...merlin,
        iconUrl: "/assets/icons/chainIcon.svg",
    },
    {
        ...bitLayer,
        iconUrl: "/assets/icons/bitlayer.svg",
    },
    {
        ...b2Network,
        iconUrl: "/assets/icons/b2.svg",
    },
    {
        ...AllLayer,
        iconUrl: "/assets/icons/ailayer.svg",
    },
];

// export const config = createConfig({
//     connectors,
//     // chains: [mainnet, merlin, bitLayer, b2Network, AllLayer],
//     chains,
//     transports: {
//         [mainnet.id]: http(),
//         [merlin.id]: http(),
//         [bitLayer.id]: http(),
//         [b2Network.id]: http(),
//         [AllLayer.id]: http(),
//     },
// });

export const config = getDefaultConfig({
    appName: 'Pump IO',
    projectId: '57826bfdbc6cd9752e192a296fbbd40d',
    chains,
    transports: {
        [mainnet.id]: http(),
        [merlin.id]: http(),
        [bitLayer.id]: http(),
        [b2Network.id]: http(),
        [AllLayer.id]: http(),
    },
    ssr: true,
});

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const signer = useEthersSigner();
    const ethersProvider = useEthersProvider();
    let web3: any
    const defaultProvider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
    if (typeof window !== "undefined") {
        web3 = new Web3(window.ethereum);
    }

    const [provider, setProvider] = useState<ContractRunner>(defaultProvider);
    const [estokkYamContract, setEstokkYamContract] = useState<Contract>({} as Contract);
    const [tokens, setTokens] = useState<any>()
    const [properties, setProperties] = useState<any>()

    const init = useCallback(async () => {
        try {
            if (!isConnected || !ethersProvider) {
                console.log('Not connected wallet');
            } else {
                setProvider(ethersProvider);
                console.log('Connected wallet');
            }

            let _estokkYamContract: any;
            if (chainId === 10200) {
                _estokkYamContract = new web3.eth.Contract(
                    EstokkYamContractAbi,
                    b2testnetAddress
                );
            }

            setEstokkYamContract(_estokkYamContract);

        } catch (err) {
            // console.log(err);
        }
    }, [isConnected, ethersProvider, provider, address, chainId]);

    useEffect(() => {
        init();

    }, [init]);



    const value = useMemo(
        () => ({
            account: address,
            chainId,
            isConnected,
            library: provider ?? signer,
            estokkYamContract,
            tokens,
            properties,
        }),
        [
            address,
            chainId,
            isConnected,
            provider,
            signer,
            estokkYamContract,
            tokens,
            properties,
        ]
    );

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};


export default Web3Context;



