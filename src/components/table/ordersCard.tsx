"use client";

import { useEffect, useState } from "react";
import { useWeb3 } from "@/hooks";
import { useToast } from "../ui/toast/use-toast";

const toNum = (price: number) => {
  const decimal: number = 12
  return price / Math.pow(10, decimal)
}

const toWei = (price: number) => {
  const decimal: number = 12
  return price * Math.pow(10, decimal)
}

export default function OrdersCard(props: any) {

  const { account, orderBookContract, web3 } = useWeb3()
  const { toast } = useToast()
  const [isAnimation, setIsAnimation] = useState<boolean>(false)
  const [orders, setOrders] = useState<any>({
    market: '',
    market_display: '',
    created_at: '',
    order_index: 0,
    side: '',
    size: '',
    trigger_price: '',
    trigger_above: false,
    acceptable_price: ''
  })

  const cancelIncreaseOrder = async () => {
    try {
      setIsAnimation(true)
      const gasPrice = await web3.eth.getGasPrice()
      await orderBookContract.methods.cancelIncreaseOrder(
        orders.order_index,
        account
      ).send({ from: account, gasPrice: gasPrice })

      const { id, dismiss } = toast({
        title: "Success",
        description: "Order is canceled successfully"
      })
      setIsAnimation(false)
    } catch (err) {
      const { id, dismiss } = toast({
        title: "Warning",
        description: "Failed Order cancel"
      })
      setIsAnimation(false)
    }
  }

  useEffect(() => {
    setOrders(props.order)
  }, [props])

  return (
    <>
      <div className="w-full p-7">
        <div className="sm:flex sm:justify-start items-baseline gap-10 grid grid-cols-2">
          <h2 className="font-medium sm:text-2xl text-xl">{orders.market_display}</h2>
          <p className={`font-medium sm:text-xl text-base ${orders.side === "short" ? "text-rose-500" : "text-semantic-success"}`}>
            {orders.side === "short" ? "Short" : "Long"}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 py-3">
          <div className="">
            <p className="text-text-secondary text-lg">
              Size <span className="block sm:inline text-white">{toWei(orders.size).toFixed(6)} BTC</span>
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Order Price{" "}
              <span className="block sm:inline text-white">{toNum(orders.trigger_price).toFixed(2)}</span>
            </p>
          </div>

          <div className="flex col-span-full justify-end gap-2 order-last lg:order-none lg:col-span-1 lg:justify-start">
            <button
              className="px-4 py-1 rounded-full border w-[150px]"
              onClick={() => { cancelIncreaseOrder() }}
            >
              {!isAnimation && "Cancel"}
              {
                isAnimation &&
                <div className="w-[100%] h-[100%] stage">
                  <div className='dot-typing'>
                  </div>
                </div>
              }
            </button>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Order Size{" "}
              <span className="block sm:inline text-white">{(toNum(orders.trigger_price) * toWei(orders.size)).toFixed(2)} USDC</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
