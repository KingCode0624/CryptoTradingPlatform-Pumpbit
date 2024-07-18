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
const TradeTabs = () => {

  const [positions, setPositions] = useState<any>([])
  const [orders, setOrders] = useState<any>([])
  const [histories, setHistorys] = useState<any>([])

  const init = async () => {
    let accessToken: string = localStorage.getItem("accessToken") as string
    const _positions = await getPosition(accessToken, market, chain)
    const _orders = await getOrders(accessToken, market, chain)
    const _histories = await getHistories(accessToken, market, chain)

    setPositions(_positions.data.positions)
    setOrders(_orders.data.orders)
    setOrders(_histories.data.histories)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      init()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <div className="rounded-3xl backdrop-blur-lg/2 bg-card border border-border ">
        <Tabs defaultValue="positions">
          <TabsList className="py-5 px-7 border-b border-border rounded-none">
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="positions">
            <div className="divide-y divide-dashed divide-border">
              {
                positions.map((item: any, idx: any) => (
                  <PositionsCard key={idx} />
                ))
              }
              <PositionsCard />
            </div>
          </TabsContent>
          <TabsContent value="orders">
            <div>
              {
                orders.map((item: any, idx: any) => (
                  <OrdersCard key={idx} />
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="history">
            {" "}
            <div className="">
              {
                histories.map((item: any, idx: any) => (
                  <HistoryCard key={idx}/>
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
