import { ContractRunner, Contract, JsonRpcSigner } from "ethers";
import { Address } from "viem";

export type Web3ContextType = {
  account?: Address;
  chainId?: number;
  isConnected?: boolean;
  library?: ContractRunner | Promise<JsonRpcSigner>;
  orderBookContract: any;
  marketDescriptorDeployerContract: any;
};

export type UtilContextType = {
  ethPrice: EthPriceType;
  headerPrice: TradeHeaderType;
  setHeaderPrice: (price: TradeHeaderType) => void;
  setEthPrice: (price: EthPriceType) => void;
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