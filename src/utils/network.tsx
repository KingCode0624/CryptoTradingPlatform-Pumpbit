import { mainnet, merlin } from "wagmi/chains";
import { Chain, } from "@rainbow-me/rainbowkit";
import { http } from "wagmi"
export const mainnetwork = mainnet
export const merlinnetwork = merlin
export const bitLayer = {
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

export const b2Network = {
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

export const b2TestNetwork = {
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

export const AllLayer = {
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

export const chains: readonly [Chain, ...Chain[]] = [
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

export const transports = {
    [mainnetwork.id]: http(),
    [merlinnetwork.id]: http(),
    [bitLayer.id]: http(),
    [b2Network.id]: http(),
    [b2TestNetwork.id]: http(),
    [AllLayer.id]: http(),
}