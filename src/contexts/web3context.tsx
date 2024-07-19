"use client"
import {
    createContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from 'react';
import Web3 from 'web3';
import { ethers, Contract, ContractRunner } from 'ethers';
import { useAccount, useChainId } from 'wagmi';

import { useEthersProvider, useEthersSigner } from '@/utils/wagmi-ethers';
import { Web3ContextType } from '../types';
import {
    b2testnet_OrderBook_Address,
    b2testnet_PositionRoute_Address,
    b2testnet_MarketManager_Address,
    b2testnet_MarketDescriptorDeployer_Address
} from '@/constants';

import orderBookAbi from "@/contracts/OrderBook.json"
import marketDescriptorDeployerAbi from "@/contracts/MarketDescriptorDeployer.json"
declare let window: any;
const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const signer = useEthersSigner();
    const ethersProvider = useEthersProvider();
    const defaultProvider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
    let web3: any;

    if (typeof window !== 'undefined' && window.ethereum) {
        web3 = new Web3(window.ethereum);
    }

    const [provider, setProvider] = useState<ContractRunner>(defaultProvider);

    const [marketManagerContract, setMarketManagerContract] = useState<Contract>({} as Contract);
    const [orderBookContract, setOrderBookContract] = useState<Contract>({} as Contract);
    const [marketDescriptorDeployerContract, setMarketDescriptorDeployerContract] = useState<Contract>({} as Contract)

    const init = useCallback(async () => {
        try {
            if (!isConnected || !ethersProvider) {
                console.log('Not connected wallet');
            } else {
                setProvider(ethersProvider);
                console.log('Connected wallet');
            }

            let _orderBookContract: any;
            let _marketDescriptorDeployerContract: any

            if (chainId === 1123) {
                _orderBookContract = new web3.eth.Contract(orderBookAbi, b2testnet_OrderBook_Address);
                _marketDescriptorDeployerContract = new web3.eth.Contract(marketDescriptorDeployerAbi, b2testnet_MarketDescriptorDeployer_Address)
            }

            setOrderBookContract(_orderBookContract);
            setMarketDescriptorDeployerContract(_marketDescriptorDeployerContract)
            
        } catch (err) {
            // console.log(err);
        }
    }, [isConnected, ethersProvider, provider]);

    useEffect(() => {
        init();

    }, [init]);



    const value = useMemo(
        () => ({
            account: address,
            chainId,
            isConnected,
            library: provider ?? signer,
            orderBookContract,
            marketDescriptorDeployerContract
        }),
        [
            address,
            chainId,
            isConnected,
            provider,
            signer,
            orderBookContract,
            marketDescriptorDeployerContract
        ]
    );
    return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export default Web3Context;
