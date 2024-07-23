"use client";
import React, { useEffect, useState } from "react";
import ArrowDownIcon from "/public/assets/arrow-trending-down.svg";
import ArrowUpIcon from "/public/assets/arrow-trending-up.svg";
import {
  SliderRoot,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "../ui/slider";
import TPSLInput from "./TPSLInput";
import { Checkbox } from "../ui/checkbox";
import LeverageSlider from "../ui-custom/leverage-slider";
import { useUtilContext } from "@/hooks";
import { useWeb3 } from "@/hooks";
import { RxValue } from "react-icons/rx";
import { ethers } from "ethers";
import {
  b2testnet_Router_Address,
  b2testnet_OrderBook_Address
} from "@/constants";
import { useToast } from "../ui/toast/use-toast";
import { getPublicMarket } from "@/services/markets";
import { chain, market } from "@/constants/index"
import {
  Lang_Market,
  Lang_Limit,
  Lang_Short,
  Lang_Long,
  Lang_Price,
  Lang_Pay,
  Lang_Max,
  Lang_Size,
  Lang_LeverageSlider,
  Lang_EntryPrice,
  Lang_PricImpact,
  Lang_LiqPrice,
  Lang_EstMargin,
  Lang_Fees,
  Lang_MarketPrice,
  Lang_QuoteAmount,
  Lang_OpenLong,
  Lang_OpenShort
} from "@/constants/language"
interface OrderDiagramProps {
  selectedPair: any;
}

export const toWei = (price: number) => {
  return Math.round(price * Math.pow(10, 18))
}

export default function OrderDiagram({ selectedPair }: OrderDiagramProps) {

  const { toast } = useToast()

  const { ethPrice, language } = useUtilContext()
  const {
    orderBookContract,
    routerContract,
    account,
    usdcTokenContract,
    usdtTokenContract
  } = useWeb3()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedSide, setSelectedSide] = useState("Long");
  const [selectedOrderType, setSelectedOrderType] = useState("Market");
  const [indexPrice, setIndexPrice] = useState<number>(0)
  const [leverage, setLeverage] = useState<number>(1);
  const [orderInitPay, setOrderInitPay] = useState<number>(0)
  const [orderPay, setOrderPay] = useState<number>(0)
  const [estimatedEth, setEstimatedEth] = useState<number>(0)
  const [currentEthPrice, setCurrentEthPrice] = useState<number>(0)
  const [entryPrice, setEntryPrice] = useState<number>(0)
  const [liquidityPrice, setLiquidityPrice] = useState<number>(0)
  const [checked, setChecked] = useState(false);
  const [tpPrice, setTpPrice] = useState<number>(0)
  const [slPrice, setSlPrice] = useState<number>(0)

  const handleLeverageChange = (value: number) => {
    setLeverage(value);
  };

  const handleCheckboxChange = (event: any) => {
    setChecked(!checked);
  };

  const handleSideSelection = (side: string) => {
    setSelectedSide(side);
  };

  const handleTypeSelection = (type: string) => {
    setSelectedOrderType(type);
  };

  const setEntryPriceInMarket = (entryPrice: number) => {
    setEntryPrice(entryPrice)
  }

  useEffect(() => {
    setEstimatedEth(orderPay / currentEthPrice)

    if (selectedOrderType === "Market")
      setEntryPriceInMarket(currentEthPrice)

  }, [currentEthPrice, orderPay,])

  useEffect(() => {
    setOrderPay(orderInitPay * leverage)
  }, [leverage])

  useEffect(() => {
    setCurrentEthPrice(ethPrice.close)
  }, [ethPrice])


  const CreateIncreateOrderBook = async () => {
    const acceptabelRate = 10 // this means 10%
    // const market = await marketDescriptorDeployerContract.methods.descriptors("ETH").call()
    const market = "0xC8dD5FBBF01392ade733b2F3db36dD87d0FAAA49"

    // let minExecuteFee = await orderBookContract.methods.minExecutionFee().call();
    let minExecuteFee = ethers.parseEther("0.005");

    const side: number = selectedSide === "Long" ? 1 : 2
    const marginDelta = BigInt(toWei(orderInitPay))
    const sizeDelta = BigInt(toWei(estimatedEth))
    const triggerMarketPrice = BigInt(toWei(entryPrice))
    const triggerAbove = true
    const acceptablePrice = toWei(currentEthPrice * (1 + acceptabelRate / 100))



    console.log("margin_delt => ", marginDelta)
    await orderBookContract.methods.createIncreaseOrder(
      market,
      side,
      marginDelta,
      sizeDelta,
      triggerMarketPrice,
      triggerAbove,
      acceptablePrice,

    ).send({ from: account, value: minExecuteFee })
  }

  const IsTransactionAvailable = async () => {
    console.log("OK1")
    console.log("Balance =>", await usdcTokenContract.methods.balanceOf(account).call())
    await usdcTokenContract.methods.approve(b2testnet_Router_Address, 100000000000 * Math.pow(10, 18)).send({ from: account })
    await routerContract.methods.approvePlugin(b2testnet_OrderBook_Address).send({ from: account })
  }

  const OpenOrderBook = async () => {


    if (toWei(orderInitPay) == 0) {
      const { id, dismiss } = toast({
        title: " Margin rice is 0!",
        description: "Please input margin price."
      })
      console.log("Price is not enogugh")
      return
    }

    await IsTransactionAvailable()
    await CreateIncreateOrderBook()
  }

  const init = async () => {
    const result = await getPublicMarket(market, chain)
    setIndexPrice(result.index_price)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      init();
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [language])

  if (isLoading) return (
    <div>
      Loading
    </div>
  )

  return (

    <div className="">
      <div className="flex flex-col gap-y-6 rounded-3xl border border-border bg-card backdrop-blur-lg/2  p-5 ">
        <div className="flex w-full flex-row text-xl font-bold border border-secondary rounded-full">
          <button
            className={`px-15 w-1/2 py-3 ${selectedSide === "Long"
              ? "bg-semantic-success"
              : "bg-secondary text-p-light"
              } rounded-s-full rounded-r-xl`}
            onClick={() => handleSideSelection("Long")}
          >
            <div className="flex flex-row items-center justify-center gap-x-1 font-bold">
              {language === "EN" ? Lang_Long.en : Lang_Long.ch}
            </div>
          </button>
          <button
            className={`px-15 w-1/2 py-3 ${selectedSide === "Short"
              ? "bg-semantic-danger"
              : "bg-secondary text-p-light"
              } rounded-e-full`}
            onClick={() => handleSideSelection("Short")}
          >
            <div className="flex flex-row items-center justify-center gap-x-1 font-bold"
              onClick={() => { handleTypeSelection("Limit") }}
            >
              {language === "EN" ? Lang_Short.en : Lang_Short.ch}
            </div>
          </button>
        </div>
        <div className="flex flex-row gap-x-5 text-xl font-bold">
          <button
            className={`text-lg font-bold ${selectedOrderType === "Market"
              ? "underline underline-offset-4"
              : ""
              }`}
            onClick={() => {
              handleTypeSelection("Market")
              setEntryPrice(currentEthPrice)
            }}
          >
            {language === "EN" ? Lang_Market.en : Lang_Market.ch}
          </button>
          <button
            className={`text-lg font-bold ${selectedOrderType === "Limit"
              ? "underline underline-offset-4"
              : ""
              }`}
            onClick={() => {
              handleTypeSelection("Limit")
              setEntryPrice(0)
            }}
          >
            {language === "EN" ? Lang_Limit.en : Lang_Limit.ch}
          </button>
        </div>
        <div className="flex flex-col gap-y-3">
          {selectedOrderType === "Limit" && (
            <div className="rounded-3xl border border-p-light bg-secondary p-5">
              <div className="flex flex-col gap-y-6">
                <div className="flex flex-row">
                  <p>
                    {language === "EN" ? Lang_Price.en : Lang_Price.ch}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-x-5">
                  <input
                    className=" bg-inherit text-lg font-bold w-full"
                    placeholder={`${language === "EN" ? Lang_MarketPrice.en : Lang_MarketPrice.ch}`}
                    step="0.01"
                    onChange={(e: any) => {
                      setEntryPrice(e.target.value)
                    }}
                  />
                  <p className="text-lg font-bold">{selectedPair.quote}</p>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-3xl border border-p-light bg-secondary p-5">
            <div className="flex flex-col gap-y-6">
              <div className="flex flex-row">
                <p>
                  {language === "EN" ? Lang_Pay.en : Lang_Pay.ch}
                </p>
              </div>
              <div className="flex w-full flex-row items-center gap-x-5">
                <input
                  className="w-full bg-inherit text-lg font-bold "
                  placeholder={`${language === "EN" ? Lang_QuoteAmount.en : Lang_QuoteAmount.ch}`}
                  step="0.01"
                  onChange={(e: any) => {
                    setOrderInitPay(e.target.value)
                    setOrderPay(Number(e.target.value) * leverage)
                  }}
                />
                <p className="text-lg font-bold">{selectedPair.quote}</p>
                <button
                  className="rounded-3xl border border-p-light bg-button-primary px-3 py-1 text-lg font-normal"
                >
                  {language === "EN" ? Lang_Max.en : Lang_Max.ch}
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-p-light bg-secondary p-5">
            <div className="flex flex-col gap-y-6">
              <div className="flex flex-row">
                <p>
                  {language === "EN" ? Lang_Size.en : Lang_Size.ch}
                </p>
              </div>
              <div className="flex flex-row items-center gap-x-5">
                <p className="mr-auto text-lg font-bold">
                  {estimatedEth}
                </p>
                <p className="text-lg font-bold">{selectedPair.base}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-row">
            <p className="mr-auto leading-relaxed">
              {language === "EN" ? Lang_LeverageSlider.en : Lang_LeverageSlider.ch}
            </p>
            <p className="text-lg font-bold">{leverage}X</p>
          </div>
          <LeverageSlider
            onLeverageChange={handleLeverageChange}
            leverage={leverage}
          />
        </div>

        <hr className=" h-[1px] border-t-0 bg-gray-600 opacity-100 dark:opacity-50 " />

        <div className="flex flex-col gap-y-3">
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">
              {language === "EN" ? Lang_EntryPrice.en : Lang_EntryPrice.ch}
            </p>
            <p>{entryPrice}</p>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">
              {language === "EN" ? Lang_PricImpact.en : Lang_PricImpact.ch}
            </p>
            <p className={`${liquidityPrice >= 0 ? "text-p-light" : "text-red-600"}`}>{liquidityPrice + "%"}</p>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">
              {language === "EN" ? Lang_LiqPrice.en : Lang_LiqPrice.ch}
            </p>
            <div className="flex flex-row gap-x-1">
              <p>
                {selectedPair.quote}
              </p>
            </div>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">
              {language === 'EN' ? Lang_EstMargin.en : Lang_EstMargin.ch}
            </p>
            <div className="flex flex-row gap-x-1">
              <p>{orderInitPay}</p>
              <p>{selectedPair.quote}</p>
            </div>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">
              {language === "EN" ? Lang_Fees.en : Lang_Fees.ch}
            </p>
            <div className="flex flex-row gap-x-1">
              <p>
                {Number(0.0005 * currentEthPrice).toFixed(2)}
              </p>
              <p>{selectedPair.quote}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-x-2">
            <Checkbox
              className="bg-inherit rounded"
              onClick={handleCheckboxChange}
              name="TP/SL"
            />
            <label> TP/SL</label>
          </div>

          {checked && (
            <div className="mt-5 flex flex-row items-center justify-center gap-x-3">
              <TPSLInput
                value={tpPrice}
                onChange={(e: any) => setTpPrice(e.target.value)}
                // onBlur={handleTpPriceBlur}
                placeholder="TP Price"
              />
              <TPSLInput
                value={slPrice}
                onChange={(e: any) => setSlPrice(e.target.value)}
                // onBlur={handleSlPriceBlur}
                placeholder="SL Price"
              />
            </div>
          )}
        </div>
        <button
          className={`px-15 rounded-3xl text-lg font-bold ${selectedSide === "Long"
            ? "bg-semantic-success"
            : "bg-semantic-danger"
            } py-3`}
          onClick={() => { OpenOrderBook() }}
        >
          {selectedSide === "Long" ?
            `${language === "EN" ? Lang_OpenLong.en : Lang_OpenLong.ch}` :
            `${language === "EN" ? Lang_OpenShort.en : Lang_OpenShort.ch}`
          }
        </button>
      </div>
    </div>
  );
}
