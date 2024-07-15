import OrderDiagram from "@/components/OrderDiagram/OrderDiagram";
import CandleStickChart from "@/components/candlestickChart";
import Tabs from "@/components/table/tabs";
import TradeHeader from "@/components/tradeHeader";

interface OrderDiagramProps {
  selectedPair: {
    quote: "BTC";
    base: "btc";
  };
}

export default function Trade() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-28 px-1 md:px-10 min-h-screen">
      <div className="col-span-2 flex flex-col gap-3">
        <div>
          <TradeHeader />
        </div>
        <div>
          <CandleStickChart
            selectedPair={{
              market: "SOLUSDT",
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
