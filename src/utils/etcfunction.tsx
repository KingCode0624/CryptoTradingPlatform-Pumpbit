import Web3 from 'web3';

export const toWei = (price: number) => {
  return Math.round(price * Math.pow(10, 18))
}

export const toInt = (price: number) => {
  return Math.round(Number(price) / Math.pow(10, 18))
}

