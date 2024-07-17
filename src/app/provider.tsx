"use client";

import React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  Chain,
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
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { mainnet, merlin } from "wagmi/chains";
import { createConfig } from "wagmi";
import { Web3Provider } from "@/contexts/web3context";
import { UtilContextProvider } from "@/contexts/utilcontext"

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

const b2TestNetwork = {
  id: 1123,
  name: "B2 Testnet",
  nativeCurrency: {
    name: "BTC",
    symbol: "BTC",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://b2-testnet.alt.technology"] }
  }
}

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
    ...b2TestNetwork,
    iconUrl: "/assets/icons/b2.svg",
  },
  {
    ...AllLayer,
    iconUrl: "/assets/icons/ailayer.svg",
  },
];


export const config = createConfig({
  connectors,
  // chains: [mainnet, merlin, bitLayer, b2Network, AllLayer],
  chains,
  transports: {
    [mainnet.id]: http(),
    [merlin.id]: http(),
    [bitLayer.id]: http(),
    [b2Network.id]: http(),
    [b2TestNetwork.id]: http(),
    [AllLayer.id]: http(),
  },
});

const queryClient = new QueryClient();

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Web3Provider>
            <UtilContextProvider>
              {children}
            </UtilContextProvider>
          </Web3Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export { Providers };
