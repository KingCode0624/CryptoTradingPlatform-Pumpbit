import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from ".";
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "../ui/slider";
import { useWeb3 } from "@/hooks";
import { useUtilContext } from "@/hooks";
import { market } from "@/constants";
import { toWei } from "@/utils/etcfunction";
import { acceptabelRate } from "@/constants";
import { useToast } from "../ui/toast/use-toast";
interface TypePosition {
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
export default function AddTpslModal({ positions }: TypePosition) {
  const { marketDescriptorDeployerContract, orderBookContract, chainId, account, web3 } = useWeb3()
  const {
    marketPrice,
    tpslGlobalList,
    istpslDataSync,
    setTpslGlobalList,
    setIsTpSlDataSync
  } = useUtilContext()
  const { toast } = useToast()
  const [tp, setTp] = useState<number>(0)
  const [sl, setSl] = useState<number>(0)
  const [size, setSize] = useState<number>(0)
  const [currentCoinPrice, setCurrentCoinPrice] = useState<number>(0)
  const cancelBtn = useRef<HTMLButtonElement | null>(null);
  const [isAnimation, setIsAnimaion] = useState<boolean>(false)
  const [tpPricePnL, setTpPricePnL] = useState<number>(0)
  const [slPricePnL, setSlPricePnL] = useState<number>(0)

  const handleSetTp = (e: any) => {
    const inputValue = e.target.value;
    if (positions.side == "") return

    if (!isNaN(Number(inputValue))) {
      setTp(inputValue);
      if (positions.side == "long") {
        setTpPricePnL(tp - Number(positions.entry_price) * Number(positions.size))
      } else {
        setTpPricePnL(Number(positions.entry_price) - tp * Number(positions.size))
      }
    } else {
      setTp(0);
    }
  }

  const handleSetSl = (e: any) => {
    const inputValue = e.target.value;
    if (positions.side == "") return

    if (!isNaN(Number(inputValue))) {
      setSl(inputValue);
      if (positions.side == "long") {
        setSlPricePnL(sl - Number(positions.entry_price) * Number(positions.size))
      } else {
        setSlPricePnL(Number(positions.entry_price) - sl * Number(positions.size))
      }
    } else {
      setTp(0);
    }
  }

  const TpSlDataSync = async () => {
    let newTpSlList: any = []
    for (let i = 0; i < tpslGlobalList.length; i++) {
      newTpSlList.push(tpslGlobalList[i])
    }
    newTpSlList.unshift({
      tpTriger: tp,
      slTriger: sl,
      size: size,
      side1: positions.side == "long" ? 1 : 2,
      side2: positions.side == "long" ? 1 : 2,
      index1: 0,
      index2: 0
    })
    await setTpslGlobalList(newTpSlList)
    await setIsTpSlDataSync(true)
  }

  const createTakeProfitStopLossOrder = async () => {
    try {
      setIsAnimaion(true)

      const market = await marketDescriptorDeployerContract.methods.descriptors("BTC").call()
      const minExecuteFee = await orderBookContract.methods.minExecutionFee().call()
      const usd = await orderBookContract.methods.usd().call()
      const side = positions.side == "long" ? 1 : 2
      const gasPrice = await web3.eth.getGasPrice()

      const marginDeltas = [
        BigInt(toWei(Number(positions.margin), chainId)),
        BigInt(toWei(Number(positions.margin), chainId)),
      ]
      const sizeDelta = [
        BigInt(toWei(Number(positions.margin) * size / currentCoinPrice, chainId)),
        BigInt(toWei(Number(positions.margin) * size / currentCoinPrice, chainId))
      ]

      const triggerMarketPrice = [
        BigInt(toWei(tp, chainId)),
        BigInt(toWei(sl, chainId))
      ]

      const acceptablePrice = side == 1 ?
        [
          toWei(currentCoinPrice * (1 + acceptabelRate / 100), chainId),
          toWei(currentCoinPrice * (1 + acceptabelRate / 100), chainId),
        ] :
        [
          toWei(currentCoinPrice * (1 - acceptabelRate / 100), chainId),
          toWei(currentCoinPrice * (1 - acceptabelRate / 100), chainId),
        ]

      const newIndex = await orderBookContract.methods.createTakeProfitAndStopLossOrders(
        market,
        side,
        marginDeltas,
        sizeDelta,
        triggerMarketPrice,
        acceptablePrice,
        account
      ).send({ from: account, value: (minExecuteFee * BigInt(2)), gasPrice: gasPrice })

      console.log("NewIndex =>", newIndex)
      const { id, dismiss } = toast({
        title: "Success",
        description: "TP and SL was added Success"
      })

      TpSlDataSync()

      if (cancelBtn.current) { // Type Guard
        cancelBtn.current.click();
      }
      setIsAnimaion(false)

    } catch (error) {

      setIsAnimaion(false)
      const { id, dismiss } = toast({
        title: "Warning",
        description: "TP and SL was not added"
      })

      console.log("Erro =>", error)
    }
  }

  useEffect(() => {
    setCurrentCoinPrice(marketPrice.close)
  }, [marketPrice])

  return (
    <div>
      <DialogContent className=" bg-gradient-bg flex flex-col gap-y-3 text-white  max-w-lg">
        <DialogTitle> Add TP/SL</DialogTitle>
        <div className=" mt-6">
          <div className=" flex gap-2 items-center py-5">
            <p> BTC/USD</p>

            <p className="text-semantic-success">{positions.side == "long" ? "Long" : "Short" + positions.leverage}</p>
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
        <div className="rounded-3xl border border-p-light   p-5">
          <div className="flex flex-col gap-y-4">
            <div className="flex w-full items-center  justify-between gap-x-5">
              <div>
                <input
                  className="text-white text-lg bg-black border-none bg-opacity-0 focus:outline-0"
                  type="text"
                  onChange={handleSetTp}
                  placeholder="TP Trigger Price"
                />
              </div>
              <div className="flex gap-x-2 items-center">
                <p className="text-lg">USDT</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-text-secondary text-justify pr-12">
            When the price reaches
            <span className="text-white">{" " + tp}</span>
            {" "}
            , it will trigger a Market order, and the estimated PnL will be{" "}
            <span className="text-semantic-success">{tpPricePnL.toFixed(2)} USDC</span>
          </p>
        </div>
        <div className="rounded-3xl border border-p-light  p-5 mt-3">
          <div className="flex flex-col gap-y-4">
            <div className="flex w-full items-center  justify-between gap-x-5">
              <div>
                <input
                  className="text-white text-lg bg-black border-none bg-opacity-0 focus:outline-0"
                  type="text"
                  onChange={handleSetSl}
                  placeholder="SL Trigger Price"
                />
              </div>
              <div className="flex gap-x-2 items-center">
                <p className="text-lg">USDT</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-text-secondary text-justify pr-12">
            When the price reaches
            <span className="text-white">{" " + sl}</span>
            {" "}
            , it will trigger a Market order, and the estimated PnL will be{" "}
            <span className="text-semantic-danger">{slPricePnL.toFixed(2)} USDC</span>
          </p>
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-row">
            <p className="mr-auto leading-relaxed text-lg">size</p>
            <p className="text-sm  "> {parseFloat(positions.margin) * size} BTC</p>
            <p className="text-sm  ml-2"> {size}%</p>
          </div>
          <SliderRoot step={1} min={1} max={100} defaultValue={[0]}
            onValueChange={(num: number[]) => setSize(num[0])}
          >
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb />
          </SliderRoot>
        </div>
        <hr className=" border border-border my-2" />
        <div className=" flex justify-between gap-3">
          <DialogClose className="w-full">
            <button
              ref={cancelBtn}
              className="border border-border bg-transparent px-10 py-3 rounded-full w-full"
              onClick={() => setIsAnimaion(false)}
            >
              {" "}
              Cancel
            </button>
          </DialogClose>

          <button
            className="border border-border bg-button-primary px-10 py-3 rounded-full w-full"
            onClick={() => {
              createTakeProfitStopLossOrder()
            }}
          >


            {!isAnimation && "Confirm"}

            {
              isAnimation &&
              <div className="stage">
                <div className='dot-typing'>
                </div>
              </div>
            }
          </button>
        </div>
      </DialogContent>
    </div>
  );
}
