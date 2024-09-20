"use client";
import React, { useEffect, useState } from "react";
import TPSLInput from "./TPSLInput";
import { Checkbox } from "../ui/checkbox";
import LeverageSlider from "../ui-custom/leverage-slider";
import { useUtilContext } from "@/hooks";
import { useWeb3 } from "@/hooks";
import {
  b2testnet_Router_Address,
  b2testnet_OrderBook_Address,
  b2testnetChainId,
  ailayertestnetChainId,
  ailayertestnet_Router_Address,
  ailayertestnet_OrderBook_Address,
  bevmtestnetChainId,
  bevmtestnet_Router_Address,
  bevmtestnet_OrderBook_Address,
  strMarket,
  strLimit,
  strLong,
  strShort,
  acceptabelRate
} from "@/constants";
import { useToast } from "../ui/toast/use-toast";
import { getPublicMarket } from "@/services/markets";
import { chain, market } from "@/constants/index"

import {
  toWei,
  toInt,
  getMinexecuteFee,
  ToPriceX96
} from "@/utils/etcfunction";

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
import "./style/index.css"

interface OrderDiagramProps {
  selectedPair: any;
}

export default function OrderDiagram({ selectedPair }: OrderDiagramProps) {

  const { toast } = useToast()

  const { marketPrice, language, setMarketOrderType, intervalApiTimer } = useUtilContext()

  const {
    orderBookContract,
    routerContract,
    account,
    usdcTokenContract,
    chainId,
    marketDescriptorDeployerContract,
    web3,
    isWeb3Loading
  } = useWeb3()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedSide, setSelectedSide] = useState(strLong);
  const [selectedOrderType, setSelectedOrderType] = useState(strMarket);
  const [indexPrice, setIndexPrice] = useState<number>(0)
  const [leverage, setLeverage] = useState<number>(1);
  const [orderInitPay, setOrderInitPay] = useState<number>(0)
  const [orderPay, setOrderPay] = useState<number>(0)
  const [estimatedEth, setEstimatedEth] = useState<number>(0)
  const [currentEthPrice, setCurrentEthPrice] = useState<number>(0)
  const [entryPrice, setEntryPrice] = useState<number>(0)
  const [liquidationPrice, setLiquidationPrice] = useState<number>(0)
  const [checked, setChecked] = useState(false);
  const [tpPrice, setTpPrice] = useState<number>(0)
  const [slPrice, setSlPrice] = useState<number>(0)
  const [fees, setFees] = useState<number>(0)
  const [priceImpact, setPriceImpact] = useState<number>(0)
  const [isAnimation, setAnimation] = useState<boolean>(false)
  const [orderBtnName, setOrderBtnName] = useState<string>("")
  const [tokenBalance, setTokenBalance] = useState<number>(0)

  const handleLeverageChange = (value: number) => {
    setLeverage(value);
  };

  const handleCheckboxChange = (event: any) => {
    setChecked(!checked);
  };

  const handleSideSelection = (side: string) => {
    setSelectedSide(side);
    setMarketOrderType(side)
  };

  const handleTypeSelection = (type: string) => {
    setSelectedOrderType(type);
  };

  const setEntryPriceInMarket = (entryPrice: number) => {
    setEntryPrice(entryPrice)
  }

  useEffect(() => {
    setEstimatedEth(orderPay / currentEthPrice)

    if (selectedOrderType === strMarket)
      setEntryPriceInMarket(currentEthPrice)

  }, [currentEthPrice, orderPay,])

  useEffect(() => {
    setOrderPay(orderInitPay * leverage)
  }, [leverage])

  useEffect(() => {
    setCurrentEthPrice(marketPrice.close)
  }, [marketPrice])

  useEffect(() => {
    let feeRate: number = 0
    if (leverage > 100) feeRate = 0.01
    else if (leverage > 50) feeRate = 0.02
    else if (leverage > 20) feeRate = 0.1
    else if (leverage > 0) feeRate = 0.2

    setFees(orderInitPay * feeRate / 100)

    if (selectedSide == strLong)
      setLiquidationPrice((entryPrice * 1.0041) - (entryPrice / leverage))
    else if (selectedSide == strShort)
      setLiquidationPrice((entryPrice * 1.0041) + (entryPrice / leverage))

    setPriceImpact((orderPay / 5000) * 0.001)
  }, [leverage, orderInitPay, selectedSide])


  const CreateIncreaseOrderBook = async () => {
    try {
      // this means 10%
      const market = await marketDescriptorDeployerContract.methods.descriptors("BTC").call()
      // let minExecuteFee = BigInt(Number(getMinexecuteFee()) * 2)
      let minExecuteFee = await orderBookContract.methods.minExecutionFee().call()
      const side: number = selectedSide === strLong ? 1 : 2
      const marginDelta = BigInt(toWei(orderInitPay, chainId))
      const sizeDelta = BigInt(toWei(estimatedEth, chainId))
      const triggerMarketPrice = BigInt(ToPriceX96(entryPrice))
      const triggerAbove = selectedOrderType === strMarket ? true : false
      // const acceptablePrice = side == 1 ?
      //   toWei(currentEthPrice * (1 + acceptabelRate / 100), chainId) :
      //   toWei(currentEthPrice * (1 - acceptabelRate / 100), chainId)

      const acceptablePrice = side == 1 ?
        BigInt(ToPriceX96(currentEthPrice * (1 + acceptabelRate / 100))) :
        BigInt(ToPriceX96(currentEthPrice * (1 - acceptabelRate / 100)))

      const gasPrice = await web3.eth.getGasPrice()
      console.log("Margin =>", marginDelta)
      console.log("SizeDelta =>", sizeDelta)
      console.log("triggerMarketPlace =>", triggerMarketPrice)
      console.log("Acceptable Price =>", acceptablePrice)
      console.log("Trigger Aboe =>", triggerAbove)
      await orderBookContract.methods.createIncreaseOrder(
        market,
        side,
        marginDelta,
        sizeDelta,
        triggerMarketPrice,
        triggerAbove,
        acceptablePrice,
      ).send({ from: account, value: minExecuteFee, gasPrice: gasPrice })

      const { id, dismiss } = toast({
        title: "Success",
        description: "Order is created successfully!"
      })

    } catch (err) {
      const { id, dismiss } = toast({
        title: "Failed",
        description: "Creation of Order is failed!"
      })
    }
  }

  const IsTransactionAvailable = async () => {
    let routerAddr: string = ""
    let orderBookAddr: string = ""

    if (chainId == b2testnetChainId) {
      routerAddr = b2testnet_Router_Address
      orderBookAddr = b2testnet_OrderBook_Address
    }
    else if (chainId == ailayertestnetChainId) {
      routerAddr = ailayertestnet_Router_Address
      orderBookAddr = ailayertestnet_OrderBook_Address
    }
    else if (chainId == bevmtestnetChainId) {
      routerAddr = bevmtestnet_Router_Address
      orderBookAddr = bevmtestnet_OrderBook_Address
    }

    const gasPrice = await web3.eth.getGasPrice()

    const tokenApproved = await usdcTokenContract.methods.allowance(account, routerAddr).call()

    if (tokenApproved == BigInt(0))
      try {
        await usdcTokenContract.methods.approve(routerAddr, toWei(100000000, chainId)).send({ from: account, gasPrice: gasPrice })
      } catch (err) {
        const { id, dismiss } = toast({
          title: "Failed",
          description: "Creation of Order is failed!"
        })
      }

    const isApproved = await routerContract.methods.isPluginApproved(account, orderBookAddr).call()

    if (isApproved === false)
      try {
        await routerContract.methods.approvePlugin(orderBookAddr).send({ from: account, gasPrice: gasPrice })
      } catch (err) {
        const { id, dismiss } = toast({
          title: "Failed",
          description: "Creation of Order is failed!"
        })
      }
  }

  const OpenOrderBook = async () => {
    if (toWei(orderInitPay, chainId) == 0) {
      const { id, dismiss } = toast({
        title: " Margin rice is 0!",
        description: "Please input margin price."
      })
      return
    }

    setAnimation(true)

    try {
      await IsTransactionAvailable()
      await CreateIncreaseOrderBook()
      setAnimation(false)
    } catch (err) {
      const { id, dismiss } = toast({
        title: "Failed",
        description: "Creation of Order is failed!"
      })
    }
  }

  const init = async () => {
    try {
      const result = await getPublicMarket(market, chain)
      setIndexPrice(result.index_price)
    } catch (err) {

    }
  }

  useEffect(() => {

    const interval = setInterval(() => {
      init();
    }, intervalApiTimer);

    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [language])

  useEffect(() => {
    selectedSide === strLong ?
      `${language === "EN" ? setOrderBtnName(Lang_OpenLong.en) : setOrderBtnName(Lang_OpenLong.ch)}` :
      `${language === "EN" ? setOrderBtnName(Lang_OpenShort.en) : setOrderBtnName(Lang_OpenShort.ch)}`
  }, [language, selectedSide])

  const getTokenBalance = async () => {
    try {
      const _accountBalance = await usdcTokenContract.methods.balanceOf(account).call()
      console.log("Balance => ", _accountBalance)
      setTokenBalance(_accountBalance)
    } catch (err) {
    }
  }



  useEffect(() => {
    if (isWeb3Loading) getTokenBalance()
  }, [isWeb3Loading, account])

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
            className={`px-15 w-1/2 py-3 ${selectedSide === strLong
              ? "bg-semantic-success"
              : "bg-secondary text-p-light"
              } rounded-s-full rounded-r-xl`}
            onClick={() => handleSideSelection(strLong)}
          >
            <div className="flex flex-row items-center justify-center gap-x-1 font-bold">
              {language === "EN" ? Lang_Long.en : Lang_Long.ch}
            </div>
          </button>
          <button
            className={`px-15 w-1/2 py-3 ${selectedSide === strShort
              ? "bg-semantic-danger"
              : "bg-secondary text-p-light"
              } rounded-e-full`}
            onClick={() => handleSideSelection(strShort)}
          >
            <div className="flex flex-row items-center justify-center gap-x-1 font-bold"
              onClick={() => { handleTypeSelection(strLimit) }}
            >
              {language === "EN" ? Lang_Short.en : Lang_Short.ch}
            </div>
          </button>
        </div>
        <div className="flex flex-row gap-x-5 text-xl font-bold">
          <button
            className={`text-lg font-bold ${selectedOrderType === strMarket
              ? "underline underline-offset-4"
              : ""
              }`}
            onClick={() => {
              handleTypeSelection(strMarket)
              setEntryPrice(currentEthPrice)
            }}
          >
            {language === "EN" ? Lang_Market.en : Lang_Market.ch}
          </button>
          <button
            className={`text-lg font-bold ${selectedOrderType === strLimit
              ? "underline underline-offset-4"
              : ""
              }`}
            onClick={() => {
              handleTypeSelection(strLimit)
              setEntryPrice(0)
            }}
          >
            {language === "EN" ? Lang_Limit.en : Lang_Limit.ch}
          </button>
        </div>
        <div className="flex flex-col gap-y-3">
          {selectedOrderType === strLimit && (
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
                  value={orderInitPay}
                  step="0.01"
                  onChange={(e: any) => {
                    setOrderInitPay(e.target.value)
                    setOrderPay(Number(e.target.value) * leverage)
                  }}
                />
                <p className="text-lg font-bold">{selectedPair.quote}</p>
                <button
                  className="rounded-3xl border border-p-light bg-button-primary px-3 py-1 text-lg font-normal"
                  onClick={() => setOrderInitPay(toInt(tokenBalance, chainId))}
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
            <p className={`${priceImpact >= 0 ? "text-p-light" : "text-rose-500"}`}>{priceImpact.toFixed(4) + "%"}</p>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">
              {language === "EN" ? Lang_LiqPrice.en : Lang_LiqPrice.ch}
            </p>
            <div className="flex flex-row gap-x-1">
              <p>
                {liquidationPrice.toFixed(2) + selectedPair.quote}
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
                {fees.toFixed(2)}
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
          className={`px-15 rounded-3xl text-lg font-bold ${selectedSide === strLong
            ? "bg-semantic-success"
            : "bg-semantic-danger"
            } py-3`}
          onClick={() => { OpenOrderBook() }}
        >

          {!isAnimation && orderBtnName}

          {
            isAnimation &&
            <div className="stage">
              <div className='dot-typing'>
              </div>
            </div>
          }

        </button>
      </div>
    </div>
  );
}
