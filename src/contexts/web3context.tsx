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
import { b2testnetAddress } from '@/constants';
import EstokkYamContractAbi from '@/contracts/EstokkYam.json';

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
    return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export default Web3Context;
