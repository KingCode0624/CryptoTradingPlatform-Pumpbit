import React, { useEffect, useState } from "react";
import { DialogContent, DialogTitle } from ".";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useUtilContext, useWeb3 } from "@/hooks";
import { toInt } from "@/utils/etcfunction";
import { useToast } from "../ui/toast/use-toast";

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

  const { toast } = useToast()
  const {
    tpslGlobalList,
    istpslDataSync,
    setTpslGlobalList,
    setIsTpSlDataSync } = useUtilContext()
  const { orderBookContract, account, web3 } = useWeb3()
  const [isAnimation, setIsAnimation] = useState<boolean>(false)

  const TpSlDataSync = async (index1: number, index2: number) => {
    let newTpSlList: any = []
    for (let i = 0; i < tpslGlobalList.length; i++) {
      if (tpslGlobalList[i].index1 != index1)
        newTpSlList.push(tpslGlobalList[i])
    }
    await setTpslGlobalList(newTpSlList)
    await setIsTpSlDataSync(true)
  }

  const handleCancelTpSlDecreaseOrder = async () => {
    try {
      setIsAnimation(true)
      const minExecutionFee = await orderBookContract.methods.minExecutionFee().call()
      const gasPrice = await web3.eth.getGasPrice()
      await orderBookContract.methods.cancelDecreaseOrdersBatch(
        [
          props.newTpSlTriggers.index1,
          props.newTpSlTriggers.index2,
        ]
      ).send({ from: account, gasPrice: gasPrice })
      setIsAnimation(false)

      TpSlDataSync(
        props.newTpSlTriggers.index1,
        props.newTpSlTriggers.index2
      )
      const { id, dismiss } = toast({
        title: "Success",
        description: "TP/SL Trigger Price was closed successfully."
      })

    } catch (error) {
      setIsAnimation(false)
      const { id, dismiss } = toast({
        title: "Warning",
        description: "Faild of Tp/Sl Trigger closing"
      })
    }
  }

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
          <span className="block text-white text-sm pt-3">{props.newTpSlTriggers.size}</span>
        </p>
      </div>
      <div>
        <div className="text-text-secondary text-base">
          Action
          {
            isAnimation == false ?
              (
                <RiDeleteBin6Line
                  className="block  ml-3 text-white text-3xl pt-2 hover:cursor-pointer"
                  onClick={() => {
                    handleCancelTpSlDecreaseOrder()
                  }}
                />
              ) :
              (
                <div className="stage">
                  <div className='dot-typing'>
                  </div>
                </div>
              )
          }

        </div>
      </div>
    </div>
  )
}

export default function TpslSettingModal({ setIsModalOpen, positions, tpSlOrders }: TpslSettingProps) {
  const { orderBookContract, account, chainId, web3 } = useWeb3()
  const { marketPrice, tpslGlobalList, setTpslGlobalList } = useUtilContext()
  const [newTpSlTriggers, setNewTpSlTriggers] = useState<any>([])
  const [isAnimation, setIsAnimation] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    if (tpSlOrders.length == 0) return
    console.log("TpSl Trigger Price is loaded!")
    let _newTpSlOrders: any = []
    for (let i = 0; i < tpSlOrders.length / 2; i++) {
      const tpTriger = toInt(tpSlOrders[2 * i + 1].triggerMarketPriceX96, chainId)
      const slTriger = toInt(tpSlOrders[2 * i].triggerMarketPriceX96, chainId)
      const size = toInt(tpSlOrders[2 * i + 1].sizeDelta, chainId)
      const index1 = tpSlOrders[2 * i + 1].index
      const index2 = tpSlOrders[2 * i].index
      _newTpSlOrders.push({
        tpTriger: tpTriger,
        slTriger: slTriger,
        size: size,
        index1: index1,
        index2: index2
      })
    }
    // setNewTpSlTriggers(_newTpSlOrders)
    setTpslGlobalList(_newTpSlOrders)
  }, [tpSlOrders])

  useEffect(() => {
    setNewTpSlTriggers(tpslGlobalList)
  }, [tpslGlobalList])

  const handleSetAllTriggerCancel = async () => {
    try {
      if (newTpSlTriggers.length == 0) {
        const { id, dismiss } = toast({
          title: "Warning",
          description: "There is no or Loading...."
        })
        return
      }
      setIsAnimation(true)
      const minExecutionFee = await orderBookContract.methods.minExecutionFee().call()
      const gasPrice = await web3.eth.getGasPrice()
      let tpslIndexList: number[] = []
      console.log("Cancel All =>", newTpSlTriggers)
      for (let i = 0; i < newTpSlTriggers.length; i++) {
        tpslIndexList.push(Number(newTpSlTriggers[i].index1))
        tpslIndexList.push(Number(newTpSlTriggers[i].index2))
      }
      await orderBookContract.methods.cancelDecreaseOrdersBatch(
        tpslIndexList
      ).send({ from: account, gasPrice: gasPrice })
      setIsAnimation(false)

      const { id, dismiss } = toast({
        title: "Success",
        description: "All TP/SL Trigger Price was closed successfully."
      })

    } catch (error) {
      setIsAnimation(false)
      const { id, dismiss } = toast({
        title: "Warning",
        description: "Faild of Tp/Sl Trigger closing"
      })
    }
  }

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
                Current Price
                <span className="block text-white text-sm pt-2">{marketPrice.close.toFixed(2)}</span>
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
            <button
              className="text-white text-sm font-semibold "
              onClick={() => {
                handleSetAllTriggerCancel()
              }}
            >
              {
                !isAnimation ?
                  "Cancel All" :
                  (
                    <div className="stage">
                      <div className='dot-typing'>
                      </div>
                    </div>
                  )
              }
            </button>
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
