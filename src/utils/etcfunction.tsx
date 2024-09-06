import Web3 from 'web3';
import { b2testnetDecimal, b2testnetChainId } from '@/constants';
import { useWeb3 } from '@/hooks';
import { ethers } from 'ethers';


export const toWei = (price: number, chainId: any) => {
  let decimal: number = 0
  if (chainId === b2testnetChainId)
    decimal = b2testnetDecimal
  else decimal = 6

  return Math.round(price * Math.pow(10, decimal))
}

export const toInt = (price: number, chainId: any) => {
  let decimal: number = 0
  if (chainId === b2testnetChainId)
    decimal = b2testnetDecimal
  else decimal = 6

  return Math.round(Number(price) / Math.pow(10, decimal))
}

export const getMinexecuteFee = () => {
  return ethers.parseEther("0.00005");
}

export const ToPriceX96 = (price: number) => {
  let usdDecimal = 18
  let marketDecimal = 18
  return price * Math.pow(2, 96) * Math.pow(10, usdDecimal) / Math.pow(10, marketDecimal)
}

export const FromPriceX96 = (price: number) => {
  let usdDecimal = 18
  let marketDecimal = 18
  return price * Math.pow(10, marketDecimal) / (Math.pow(2, 96) * Math.pow(10, usdDecimal))
}

export const SetCandleTicketDataProcess = async (price: any) => {
  let newPrice: any = []

  for (let i = 0; i < price.length; i++) {
    if (price[i].low === 0) {
      const _newPrice = {
        time: price[i].time,
        high: price[i].high,
        open: price[i].open,
        close: price[i].close,
        low: price[i].open > price[i].close ? price[i].close : price[i].open
      }

      newPrice.push(_newPrice)
    }
    else newPrice.push(price[i])
  }


  return newPrice
}