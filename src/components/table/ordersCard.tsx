"use client";

import { useEffect, useState } from "react";

const toNum = (price: number) => {
  const decimal: number = 12
  return price / Math.pow(10, decimal)
}

const toWei = (price: number) => {
  const decimal: number = 12
  return price * Math.pow(10, decimal)
}

export default function OrdersCard(props: any) {

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
              Size <span className="block sm:inline text-white">{toWei(orders.size)} BTC</span>
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Order Price{" "}
              <span className="block sm:inline text-white">{toNum(orders.trigger_price).toFixed(2)}</span>
            </p>
          </div>

          <div className="flex col-span-full justify-end gap-2 order-last lg:order-none lg:col-span-1 lg:justify-start">
            <button className="px-4 py-1 rounded-full border-2">Cancel</button>
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
