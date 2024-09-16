"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "../models";
import AddTpslModal from "../models/AddTpslModal";
import TpslSettingModal from "../models/tpslSettingModal";
import { useUtilContext, useWeb3 } from "@/hooks";
import { useToast } from "../ui/toast/use-toast";
import RectProgressBar from "../rectprogressbar";
export default function PositionsCard(props: any) {
  const { toast } = useToast()
  const { positionRouterContract, account, web3, marketDescriptorDeployerContract } = useWeb3()
  const { marketPair } = useUtilContext()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tpslOrders, setTpSlOrders] = useState<any>([])
  const [isAnimation, setIsAnimation] = useState<boolean>(false)
  const [positions, setPositions] = useState<any>({
    market: "",
    market_display: "",
    margin: "",
    entry_price: "",
    net_funding: "0",
    liquidation_price: "",
    leverage: 0,
    side: "",
    size: 0,
    status: "",
    unrealized_pnl: "0"
  })

  useEffect(() => {
    setPositions(props.position)
  }, [props.position])

  useEffect(() => {
    setTpSlOrders(props.tpSlOrders)
  }, [props.tpSlOrders])

  const closePosition = async () => {
    try {
      setIsAnimation(true)
      const market = marketPair == "btcusdt" ?
        await marketDescriptorDeployerContract.methods.descriptors("BTC").call() :
        await marketDescriptorDeployerContract.methods.descriptors("ETH").call()

      const side = positions.side == "long" ? 1 : 2
      const minExecutionFee = await positionRouterContract.methods.minExecutionFee().call()
      const gasPrice = await web3.eth.getGasPrice()

      await positionRouterContract.methods.createClosePositionsBatch(
        [{
          market: market,
          side: side
        }],
        account
      ).send({ from: account, value: minExecutionFee, gasPrice: gasPrice })

      const { id, dismiss } = toast({
        title: "Success",
        description: "Position was closed successfully."
      })
      setIsAnimation(false)
    } catch (error) {
      console.log("Error =>", error)
      const { id, dismiss } = toast({
        title: "Warning",
        description: "Failed Closing position."
      })
      setIsAnimation(false)
    }
  }

  return (
    <>
      <div className="w-full p-7">
        <div className="sm:flex sm:justify-start items-baseline gap-10 grid grid-cols-3">
          <h2 className="font-medium sm:text-2xl text-xl">{positions.market_display}</h2>
          <p className={`font-medium sm:text-xl text-base ${positions.side === "long" ? "text-semantic-success" : "text-rose-500"}`}>
            {
              positions.side === "long" ? "Long" : positions.side === "short" ? "Short" : "" + " "
            }
            {
              " " + positions.leverage + "x"
            }
          </p>
          <p className="font-medium sm:text-xl text-base flex justify-center items-center gap-1">
            <RectProgressBar percent={63} />
            63.95%
          </p>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 py-3">
          <div className="">
            <p className="text-text-secondary text-lg">
              Size <span className="block sm:inline text-white">{positions.size} BTC</span>
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Entry Price{" "}
              <span className="block sm:inline text-white">{positions.entry_price}</span>
            </p>
          </div>
          <div>
            <p className="text-text-secondary ">
              Unrealized PNL{" "}
              <span className="block sm:inline text-semantic-danger md:text-lg text-xs">
                {positions.unrealized_pnl}
              </span>
            </p>
          </div>
          <div className="flex col-span-full justify-end gap-2 order-last lg:order-none lg:col-span-1 ">
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-4 py-1 rounded-full border w-[150px]">
                  TP/SL
                </button>
              </DialogTrigger>

              <button
                className="px-4 py-1 rounded-full border w-[150px]"
                onClick={() => {
                  closePosition()
                }}
              >
                {!isAnimation && "Close"}
                {
                  isAnimation &&
                  <div className="w-[100%] h-[100%] stage">
                    <div className='dot-typing'>
                    </div>
                  </div>
                }
              </button>
              <TpslSettingModal setIsModalOpen={setIsModalOpen} positions={positions} tpSlOrders={tpslOrders} />
            </Dialog>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              {<AddTpslModal positions={positions} />}
            </Dialog>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Margin{" "}
              <span className="block sm:inline text-white">{positions.margin} USDC</span>
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Liq. Price{" "}
              <span className="block sm:inline text-white">{positions.liquidation_price}</span>
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Net Funcding{" "}
              <span className="block sm:inline text-semantic-success">
                {positions.net_funding}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
