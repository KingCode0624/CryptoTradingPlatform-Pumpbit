import Web3 from 'web3';
import { b2testnetDecimal, b2testnetChainId } from '@/constants';
import { useWeb3 } from '@/hooks';
export const toWei = (price: number, chainId: any) => {
  let decimal: number = 0
  if (chainId === b2testnetChainId)
    decimal = b2testnetDecimal
  else decimal = 18

  return Math.round(price * Math.pow(10, decimal))
}

export const toInt = (price: number, chainId: any) => {
  let decimal: number = 0
  if (chainId === b2testnetChainId)
    decimal = b2testnetDecimal
  else decimal = 18

  return Math.round(Number(price) / Math.pow(10, decimal))
}

