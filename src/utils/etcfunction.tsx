export const toWei = (price: number) => {
    return Math.round(price * Math.pow(10, 18))
  }