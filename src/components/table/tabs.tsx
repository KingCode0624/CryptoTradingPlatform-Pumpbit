"use client";
import React, { useEffect, useState } from "react";
import PositionsCard from "./positionsCard";
import OrdersCard from "./ordersCard";
import HistoryCard from "./historyCard";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "../ui/tabs";
import { getPosition, getMarketInfo } from '@/services/markets'
import { chain, market } from "@/constants/index"
import { useUtilContext } from "@/hooks";
import axios from "axios";

const TradeTabs = () => {

  // const init = async () => {
  //   console.log("Hello")
  //   if (accessToken === "") return
  //   let accessToken: string = localStorage.getItem("accessToken") as string

  //   const result = await getPosition(accessToken, market, chain)
  //   console.log("Result => ", result)
  // }

  const init = async () => {
    console.log("Heqwe")
    let accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get('https://api.inftytrade.xyz/v1/api/position-history', {
        headers: {
          'Authorization': accessToken
        }
      });
      console.log("Result => ", response.data);
    } catch (error) {
      console.error("Error fetching position history:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // init()
    }, 5000)

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
              <button
                onClick={() => {
                  init()
                }}
              >
                Hello
              </button>
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
