"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { TabsList, Tabs, TabsTrigger, TabsContent } from "../ui/tabs";
import Image from "next/image";
import Link from "next/link";
import OverviewCard from "./overviewCard";
import StakeCard from "./stakeCard";
import StakePbtCard from "./stakePbtCard";
import PositionMiningCardRe from "./positionMiningCard";
import { PositionMiningCard } from "./positionMiningCardRe";
import { LMiningAndPFiler } from "./liquidityMining";
import { Dialog, DialogTrigger } from "../models";
import ClaimModal from "../models/claimModal";
import PositionHistoryCard from "./positionHistoryCard";
import { useUtilContext } from "@/hooks";
import { Lang_24hFee_Income, Lang_LiquidityMining, Lang_MaxAPR, Lang_MyLiquidity, Lang_MyPosition, Lang_Pool, Lang_PositionMining, Lang_TotalLiquidity, Lang_TotalPosition } from "@/constants/language";
import { useWeb3 } from "@/hooks";
import { Poller_One } from "next/font/google";

const TitlesPumpFiler = [
  {
    title1: "Pool",
    title2: "Max APR",
    title3: "24h Fee Income",
    title4: "Win Rate%",
    title5: "Total Liquidity",
    title6: "My Liquidity",
    title7: "Claimable Rewards",
  },
];


const PositionMiningData = [
  {
    pool: "BTC/USDC",
    maxApr: 294.12,
    totalPosition: 103,
    myPosition: "Comming soon",
  }
]

const EarnTabs = () => {
  const { positionRouterContract } = useWeb3()
  const { language } = useUtilContext()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [Data, setData] = useState<any>([
    {
      pool: "ETH/USDC",
      maxAPR: 294.12,
      feeIncome: 1.5,
      dailyEmission: 893.23,
      totalLiquidity: 1000,
      myLiquidity: 1000,
      claimableRewards: 1000,
    },
  ])

  useEffect(() => {
    const interval = setInterval(async () => {
      const index = await positionRouterContract.methods.increaseLiquidityPositionIndex().call()

      // for (let i = 0; i <= index; i++) {  
      // }
      const data = await positionRouterContract.methods.increaseLiquidityPositionRequests(index).call()
      const _data = {
        pool: "BTC/USDC",
        maxAPR: 294.12,
        feeIncome: 1.5,
        dailyEmission: 893.23,
        totalLiquidity: 1000,
        myLiquidity: 1000,
        claimableRewards: 1000,
      }
      console.log("Index => ", index)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setIsLoading(false)
  }, [language])

  if (isLoading) return (
    <div>
      Loading ...
    </div>
  )

  const PositionMiningTitle = [
    {
      title1: `${language === 'EN' ? Lang_Pool.en : Lang_Pool.ch}`,
      title2: `${language === "EN" ? Lang_MaxAPR.en : Lang_MaxAPR.ch}`,
      title3: `${language === "EN" ? Lang_TotalPosition.en : Lang_TotalPosition.ch}`,
      title4: `${language === "EN" ? Lang_MyPosition.en : Lang_MyPosition.ch}`,
    },
  ];

  const Titles = [
    {
      title1: `${language === 'EN' ? Lang_Pool.en : Lang_Pool.ch}`,
      title2: `${language === "EN" ? Lang_MaxAPR.en : Lang_MaxAPR.ch}`,
      title3: `${language === "EN" ? Lang_24hFee_Income.en : Lang_24hFee_Income.ch}`,
      title4: `${language === "EN" ? Lang_TotalLiquidity.en : Lang_TotalLiquidity.ch}`,
      title5: `${language === "EN" ? Lang_MyLiquidity.en : Lang_MyLiquidity.ch}`,
    },
  ];
  return (
    <div>
      <div className="rounded-3xl backdrop-blur-lg/2 bg-card border border-border ">
        <Tabs defaultValue="Position Mining">
          <TabsList className="py-5 lg:px-7  px-3 lg:overflow-hidden overflow-x-scroll flex justify-between items-center border-b border-border rounded-none">
            <div className="flex justify-center items-center gap-x-3 lg:gap-x-5">
              <TabsTrigger value="Position Mining">
                {language === 'EN' ? Lang_PositionMining.en : Lang_PositionMining.ch}
              </TabsTrigger>
              <TabsTrigger value="Liquidity Mining">
                {
                  language === "EN" ? Lang_LiquidityMining.en : Lang_LiquidityMining.ch
                }
              </TabsTrigger>
            </div>
            <div>
              <div className="hidden lg:flex justify-end  items-center w-full font-bold text-xl">
              </div>
            </div>
          </TabsList>



          <TabsContent value="Position Mining">
            <div>
              {
                PositionMiningTitle.map((it, idx) => (
                  <PositionMiningCard
                    key={idx}
                    title={PositionMiningTitle}
                    data={PositionMiningData} />
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="Liquidity Mining">
            <div className="">{ }</div>
            {Titles.map((item, index) => (
              <LMiningAndPFiler
                key={index}
                title={Titles}
                data={Data} />
            ))}
          </TabsContent>
          <TabsContent value="Pump Flier">
            {TitlesPumpFiler.map((data, index) => (
              <LMiningAndPFiler
                key={index}
                title={TitlesPumpFiler}
                data={Data}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EarnTabs;
