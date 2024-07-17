"use client"
import OrderDiagram from "@/components/OrderDiagram/OrderDiagram";
import CandleStickChart from "@/components/candlestickChart";
import Tabs from "@/components/table/tabs";
import TradeHeader from "@/components/tradeHeader";
import { useEffect } from "react";
import { useWeb3 } from "@/hooks";

interface OrderDiagramProps {
  selectedPair: {
    quote: "BTC";
    base: "btc";
  };
}

export default function Trade() {
  const { account, chainId } = useWeb3()
  useEffect(() => {
    console.log("ChainId =>>>", chainId)
    console.log("Account =>>", account)
  }, [chainId])

  const market: string = "btcusdt"


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-28 px-1 md:px-10 min-h-screen">
      <div className="col-span-2 flex flex-col gap-3">
        <div>
          <TradeHeader />
        </div>
        <div>
          <CandleStickChart
            selectedPair={{
              market: market,
              base: "SOL",
              quote: "USDT",
            }}
          />
        </div>
        <div>
          <Tabs />
        </div>
      </div>
      <div className="col-span-1">
        <OrderDiagram
          selectedPair={{ market: "SOLUSDT", base: "SOL", quote: "USDT" }}
        />
      </div>
    </div>
  );
}
