"use client";
import React, { useEffect, useState } from "react";
import PositionsCard from "./positionsCard";
import OrdersCard from "./ordersCard";
import HistoryCard from "./historyCard";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "../ui/tabs";
import { getPosition } from '@/services/markets'
import { chain, market } from "@/constants/index"
import { useUtilContext } from "@/hooks";
const TradeTabs = () => {
  const init = async () => {

    let accessToken: string = localStorage.getItem("accessToken") as string
    if (accessToken === "") return

    const result = await getPosition(accessToken, market, chain)
    console.log("Result => ", result)
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
              <PositionsCard />
              <PositionsCard />
              <PositionsCard />
            </div>
          </TabsContent>
          <TabsContent value="orders">
            <div>
              <OrdersCard />
            </div>
          </TabsContent>
          <TabsContent value="history">
            {" "}
            <div className="">
              <HistoryCard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradeTabs;
