"use client";
import React, { useEffect, useState } from "react";
import PositionsCard from "./positionsCard";
import OrdersCard from "./ordersCard";
import HistoryCard from "./historyCard";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  getPosition,
  getOrders,
  getHistories
} from '@/services/markets'
import { chain, market } from "@/constants/index"
import { useWeb3, useUtilContext } from "@/hooks";
import {
  Lang_Orders,
  Lang_Positions,
  Lang_History
} from "@/constants/language";
import { Authorization, Refresh } from "@/authorization"
import { SetOrdersDataProcess } from "@/utils/etcfunction";

const TradeTabs = () => {
  const { web3, account, isConnected, orderBookContract, isWeb3Loading } = useWeb3()
  const { language, intervalApiTimer } = useUtilContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [positions, setPositions] = useState<any>([])
  const [orders, setOrders] = useState<any>([])
  const [histories, setHistorys] = useState<any>([])
  const [isTimer, setTimer] = useState<boolean>(false)
  const [intervalApiTimerInPosition, setIntervalApiTimerInPosition] = useState<number>(100000)
  const [tpSlOrders, setTpSlOrders] = useState<any>([])
  const [isPositionsLoading, setIsPositionsLoading] = useState<boolean>(false)
  const getTpSlLists = async () => {
    console.log("Data Loading ....")

    const index = await orderBookContract.methods.ordersIndexNext().call()

    let _tpslOrders: any = []
    for (let i = 1890; i < Number(index); i++) {
      const __tpslOrder = await orderBookContract.methods.decreaseOrders(i).call()
      if (__tpslOrder.receiver == account) {
        _tpslOrders.push({
          index: i,
          acceptableTradePriceX96: __tpslOrder.acceptableTradePriceX96,
          account: __tpslOrder.account,
          executionFee: __tpslOrder.executionFee,
          marginDelta: __tpslOrder.marginDelta,
          market: __tpslOrder.market,
          receiver: __tpslOrder.receiver,
          side: __tpslOrder.side,
          sizeDelta: __tpslOrder.sizeDelta,
          triggerAbove: __tpslOrder.triggerAbove,
          triggerMarketPriceX96: __tpslOrder.triggerMarketPriceX96
        })
      }
    }

    setTpSlOrders(_tpslOrders)
  }

  useEffect(() => {
    if (isWeb3Loading == true) {
      getTpSlLists()
    }
  }, [isPositionsLoading])

  const initAuthorization = async () => {
    if (account === undefined) return
    const result = await Authorization(account, web3)
    await localStorage.setItem("accessToken", result.access_token)
    await localStorage.setItem("refreshToken", result.refresh_token)
  }

  const reFreshAuthorization = async (refreshToken: string) => {
    const result: any = await Refresh(refreshToken)
    await localStorage.setItem("accessToken", result.access_token)
  }

  const ReAuthorization = async () => {

    if (account === undefined) return

    const accessToken: string = localStorage.getItem("accessToken") as string
    const refreshToken: string = localStorage.getItem("refreshToken") as string

    if (refreshToken == null || refreshToken == "undefined") {
      await initAuthorization()
      await setTimer(false)
    }
    else {
      try {
        await reFreshAuthorization(refreshToken)
        await setTimer(false)
      } catch (error) {
        await initAuthorization()
      }
    }
    console.log("Authorization is finished")
    await setIntervalApiTimerInPosition(intervalApiTimer)
    setIsLoading(false)
  }

  const getDatas = async () => {
    await setIsLoading(true)
    let accessToken: string = localStorage.getItem("accessToken") as string
    console.log("Back-End Data is loading ...")
    try {
      const _positions = await getPosition(accessToken, market, chain)
      if (_positions.code == "ERR_BAD_REQUEST") {
        await setTimer(true)
      }
      else {
        const _orders = await getOrders(accessToken, market, chain)
        const _histories = await getHistories(accessToken, market, chain)

        await setPositions(_positions.data.positions)
        await setOrders(await SetOrdersDataProcess(_orders.data.orders))
        await setHistorys(_histories.data.histories)
        await setIsPositionsLoading(true)
      }


    } catch (err) {
      console.log("Error =>", err)
    }
  }

  useEffect(() => {
    if (isConnected == true) {
      ReAuthorization()
    }
  }, [intervalApiTimer])

  useEffect(() => {
    const interval = setInterval(() => {
      getDatas()
    }, intervalApiTimerInPosition)

    return () => clearInterval(interval)

  }, [intervalApiTimerInPosition])

  if (isLoading == false) return (<></>)

  return (
    <div>
      <div className="rounded-3xl backdrop-blur-lg/2 bg-card border border-border ">
        <Tabs defaultValue="positions">
          <TabsList className="py-5 px-7 border-b border-border rounded-none">
            <TabsTrigger value="positions">
              {
                language === "EN" ? Lang_Positions.en : Lang_Positions.ch
              }
            </TabsTrigger>
            <TabsTrigger value="orders">
              {
                language === "EN" ? Lang_Orders.en : Lang_Orders.ch
              }
            </TabsTrigger>
            <TabsTrigger value="history">
              {
                language === "EN" ? Lang_History.en : Lang_History.ch
              }
            </TabsTrigger>
          </TabsList>
          <TabsContent value="positions">
            <div className="divide-y divide-dashed divide-border">
              {
                positions.length > 0 ?
                  positions.map((item: any, idx: any) => (
                    <PositionsCard key={idx} position={item} tpSlOrders={tpSlOrders} />
                  )) : <></>
              }
            </div>
          </TabsContent>
          <TabsContent value="orders">
            <div>
              {
                orders.map((item: any, idx: any) => (
                  <OrdersCard key={idx} order={item} />
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="history">
            {" "}
            <div className="">
              {
                histories.map((item: any, idx: any) => (
                  <HistoryCard key={idx} />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>


    </div>
  );
};

export default TradeTabs;
