import Web3 from 'web3';

export const toWei = (price: number) => {
  return Math.round(price * Math.pow(10, 18))
}

export const toInt = (price: number) => {
  return Math.round(Number(price) / Math.pow(10, 18))
}

export const withOutEIP = async (contract: any) => {
  let web3: any;

  if (typeof window !== 'undefined' && (window.ethereum || window.web3)) {
    web3 = new Web3(window.ethereum || window.web3.currentProvider);
  } else {
    throw new Error('Ethereum wallet is not connected.');
  }

  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      throw new Error('No accounts found. Ensure your wallet is unlocked.');
    }

    const fromAddress = accounts[0]; // Use the first account
    const gasPriceInGwei = '20'; // Example gas price in Gwei
    const gasPriceInWei = web3.utils.toWei(gasPriceInGwei, 'gwei');
    const transaction = {
      from: fromAddress,
      gas: 300000, // Set an appropriate gas limit
      gasPrice: gasPriceInWei,
      data: contract.methods.claimTokens().encodeABI() // Fix method call
    };

    const receipt = await web3.eth.sendTransaction(transaction);
    console.log(receipt);
  } catch (error) {
    console.error(error);
  }
}