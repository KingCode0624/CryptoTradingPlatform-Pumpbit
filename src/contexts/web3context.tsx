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
    b2testnet_MarketDescriptorDeployer_Address,
    b2testnet_USDT_Address,
    b2testnet_Router_Address
} from '@/constants';

import orderBookAbi from "@/contracts/OrderBook.json"
import marketDescriptorDeployerAbi from "@/contracts/MarketDescriptorDeployer.json"
import usdtTokenContractAbi from "@/contracts/Token.json"
import routerContractAbi from "@/contracts/Router.json"


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

    const [usdtTokenContract, setUsdtTokenContract] = useState<Contract>({} as Contract)
    const [marketManagerContract, setMarketManagerContract] = useState<Contract>({} as Contract);
    const [orderBookContract, setOrderBookContract] = useState<Contract>({} as Contract);
    const [marketDescriptorDeployerContract, setMarketDescriptorDeployerContract] = useState<Contract>({} as Contract)
    const [routerContract, setRouterContract] = useState<Contract>({} as Contract)

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
            let _usdtTokenContract: any
            let _routerContract: any
            if (chainId === 1123) {
                _orderBookContract = new web3.eth.Contract(orderBookAbi, b2testnet_OrderBook_Address);
                _marketDescriptorDeployerContract = new web3.eth.Contract(marketDescriptorDeployerAbi, b2testnet_MarketDescriptorDeployer_Address)
                _usdtTokenContract = new web3.eth.Contract(usdtTokenContractAbi, b2testnet_USDT_Address)
                _routerContract = new web3.eth.Contract(routerContractAbi, b2testnet_Router_Address)
            }

            setOrderBookContract(_orderBookContract);
            setMarketDescriptorDeployerContract(_marketDescriptorDeployerContract)
            setUsdtTokenContract(_usdtTokenContract)
            setRouterContract(_routerContract)
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
            marketDescriptorDeployerContract,
            usdtTokenContract,
            routerContract
        }),
        [
            address,
            chainId,
            isConnected,
            provider,
            signer,
            orderBookContract,
            marketDescriptorDeployerContract,
            usdtTokenContract,
            routerContract
        ]
    );
    return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export default Web3Context;
