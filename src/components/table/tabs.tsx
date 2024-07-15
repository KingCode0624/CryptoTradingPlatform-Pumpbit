"use client";
import React from "react";
import PositionsCard from "./positionsCard";
import OrdersCard from "./ordersCard";
import HistoryCard from "./historyCard";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "../ui/tabs";

const TradeTabs = () => {
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
