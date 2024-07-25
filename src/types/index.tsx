import { ContractRunner, Contract, JsonRpcSigner } from "ethers";
import { Address } from "viem";

export type Web3ContextType = {
  account?: Address;
  chainId?: number;
  isConnected?: boolean;
  library?: ContractRunner | Promise<JsonRpcSigner>;
  marketDescriptorDeployerContract: any;
  orderBookContract: any;
  usdcTokenContract: any;
  routerContract: any;
  positionRouterContract: any;
  faucetContract: any;
};

export type UtilContextType = {
  ethPrice: EthPriceType;
  headerPrice: TradeHeaderType;
  sliprate: number;
  language: string;
  marketOrderType: string;
  setMarketOrderType: (type: string) => void;
  setSlipRate: (rate: number) => void;
  setHeaderPrice: (price: TradeHeaderType) => void;
  setEthPrice: (price: EthPriceType) => void;
  setLanguage: (language: string) => void;
}

export type TradeHeaderType = {
  price24High: number;
  price24Low: number;
}
export type EthPriceType = {
  open: number,
  close: number,
  high: number,
  low: number
}