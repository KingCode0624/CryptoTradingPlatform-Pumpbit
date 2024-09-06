"use client";
import React, { useEffect, useState } from "react";
import PositionsCard from "./positionsCard";
import OrdersCard from "./ordersCard";
import HistoryCard from "./historyCard";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  getPosition,
  getMarketInfo,
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
import { Authorization } from "@/authorization"

const TradeTabs = () => {
  const { web3, account, isConnected } = useWeb3()
  const { language } = useUtilContext()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [positions, setPositions] = useState<any>([])
  const [orders, setOrders] = useState<any>([])
  const [histories, setHistorys] = useState<any>([])
  const [isTimerPause, setTimerPause] = useState<boolean>(false)

  const ReAuthorization = async () => {
    if (account === undefined) return
    const result = await Authorization(account, web3)
    localStorage.setItem("accessToken", result)
    setTimerPause(false)
  }

  const init = async () => {

    console.log("Timer is on")

    let accessToken: string = localStorage.getItem("accessToken") as string
    try {
      const _positions = await getPosition(accessToken, market, chain)

      if (_positions.code == "ERR_BAD_REQUEST") {
        setTimerPause(true)
        ReAuthorization()
      }

      const _orders = await getOrders(accessToken, market, chain)
      const _histories = await getHistories(accessToken, market, chain)

      await setPositions(_positions.data.positions)
      await setOrders(_orders.data.orders)
      await setHistorys(_histories.data.histories)

    } catch (err) {

    }
  }

  useEffect(() => {
    if (isConnected)
      setTimerPause(false)
  }, [isConnected])

  useEffect(() => {
    let interval: any = null
    if (isTimerPause == false) {
      interval = setInterval(() => {
        init()
      }, 3000)
    } else clearInterval(interval)

    return () => clearInterval(interval)
  }, [isTimerPause])

  useEffect(() => {
    setIsLoading(false)
  }, [language])


  if (isLoading) return (<></>)

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
                    <PositionsCard key={idx} position={item} />
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
