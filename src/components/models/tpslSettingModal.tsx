import React, { useEffect, useState } from "react";
import { DialogContent, DialogTitle } from ".";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useWeb3 } from "@/hooks";
import { toInt } from "@/utils/etcfunction";

interface TpslSettingProps {
  setIsModalOpen: (config: boolean) => void;
  tpSlOrders: any;
  positions: {
    market: string,
    market_display: string,
    margin: string,
    entry_price: string,
    net_funding: string,
    liquidation_price: string,
    leverage: number,
    side: string,
    size: number,
    status: string,
    unrealized_pnl: string
  }
}

const TpSlLists = (props: any) => {

  useEffect(() => {

  }, [])

  return (
    <div className="flex justify-between mt-4 ">
      <div>
        <p className="text-text-secondary">
          TP trigger price
          <span className="block text-white text-sm pt-3">{props.newTpSlTriggers.tpTriger}</span>
        </p>
      </div>
      <div>
        <p className="text-text-secondary">
          SL trigger price
          <span className="block text-white text-sm pt-3">{props.newTpSlTriggers.slTriger}</span>
        </p>
      </div>
      <div>
        <p className="text-text-secondary text-sm">
          Amount
          <span className="block text-white text-sm pt-3">12.4122</span>
        </p>
      </div>
      <div>
        <div className="text-text-secondary text-base">
          Action
          <RiDeleteBin6Line className="block  ml-3 text-white text-3xl pt-2 hover:cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

export default function TpslSettingModal({ setIsModalOpen, positions, tpSlOrders }: TpslSettingProps) {
  const { orderBookContract, account, chainId } = useWeb3()

  const [newTpSlTriggers, setNewTpSlTriggers] = useState<any>([])
  useEffect(() => {
    console.log("TPSL OK =>", tpSlOrders)

    let _newTpSlOrders: any = []
    for (let i = 0; i < tpSlOrders.length / 2; i++) {
      const tpTriger = toInt(tpSlOrders[2 * i].triggerMarketPriceX96, chainId)
      const slTriger = toInt(tpSlOrders[2 * i + 1].triggerMarketPriceX96, chainId)
      _newTpSlOrders.push({
        tpTriger: tpTriger,
        slTriger: slTriger
      })
    }

    setNewTpSlTriggers(_newTpSlOrders)
  }, [tpSlOrders])

  useEffect(() => {
    console.log("New TPSL =>", newTpSlTriggers)
  }, [newTpSlTriggers])
  return (
    <div>
      <DialogContent className=" bg-gradient-bg flex flex-col gap-y-3 text-white  max-w-xl">
        <DialogTitle> Tp/Sl Setting </DialogTitle>
        <div className=" mt-6">
          <div className=" flex gap-2 items-center py-5">
            <p> BTC/USD</p>

            <p className={`${positions.side == "long" ? "text-semantic-success" : "text-rose-500"}`}>
              {positions.side == "long" ? "Long " : "Short "}
              {positions.leverage + "x"}
            </p>
          </div>
          <div className="flex  justify-between  ">
            <div>
              <p className="text-text-secondary">
                Entry Price
                <span className="block text-white text-sm pt-2">{positions.entry_price}</span>
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">
                Last Price
                <span className="block text-white text-sm pt-2">12.4122</span>
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-base">
                Liq Price
                <span className="block text-white text-sm pt-2">{positions.liquidation_price}</span>
              </p>
            </div>
          </div>
        </div>
        <hr className=" border border-border my-2" />
        <div className="flex justify-between items-center ">
          <div>
            <p className="text-white text-sm font-semibold">
              My TP/SL Settings
            </p>
          </div>
          <div>
            <p className="text-white text-sm font-semibold ">Cancel all</p>
          </div>
          <div>
            <button
              className="text-white text-base bg-button-primary rounded-full px-3 py-1"
              onClick={() => setIsModalOpen(true)}
            >
              Add TP/SL
            </button>
          </div>
        </div>
        {
          newTpSlTriggers.map((itx: any, idx: any) => (
            <TpSlLists newTpSlTriggers={itx} key={idx} />
          ))
        }

      </DialogContent>
    </div>
  );
}
