"use client";
import React from "react";
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
import PositionMiningCard from "./positionMiningCard";
import { LMiningAndPFiler } from "./liquidityMining";
import { Dialog, DialogTrigger } from "../models";
import ClaimModal from "../models/claimModal";
import PositionHistoryCard from "./positionHistoryCard";

const Data = [
  {
    pool: "ETH/USDC",
    maxAPR: 294.12,
    feeIncome: 1.5,
    dailyEmission: 893.23,
    totalLiquidity: 1000,
    myLiquidity: 1000,
    claimableRewards: 1000,
  },
  {
    pool: "ETH/USDC",
    maxAPR: 294.12,
    feeIncome: 1.5,
    dailyEmission: 893.23,
    totalLiquidity: 1000,
    myLiquidity: 1000,
    claimableRewards: 1000,
  },
  {
    pool: "ETH/USDC",
    maxAPR: 294.12,
    feeIncome: 1.5,
    dailyEmission: 893.23,
    totalLiquidity: 1000,
    myLiquidity: 1000,
    claimableRewards: 1000,
  },
];
const Titles = [
  {
    title1: "Pool",
    title2: "Max APR",
    title3: "24h Fee Income",
    title4: "Daily Emission",
    title5: "Total Liquidity",
    title6: "My Liquidity",
    title7: "Claimable Rewards",
  },
];
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

const EarnTabs = () => {
  return (
    <div>
      <div className="rounded-3xl backdrop-blur-lg/2 bg-card border border-border ">
        <Tabs defaultValue="Staking">
          <TabsList className="py-5 lg:px-7  px-3 lg:overflow-hidden overflow-x-scroll flex justify-between items-center border-b border-border rounded-none">
            <div className="flex justify-center items-center gap-x-3 lg:gap-x-5">
              <TabsTrigger value="Staking">Staking</TabsTrigger>
              <TabsTrigger value="Position Mining">Position Mining</TabsTrigger>
              <TabsTrigger value="Liquidity Mining">
                Liquidity Mining
              </TabsTrigger>
              <TabsTrigger value="Pump Flier">Pump Flier</TabsTrigger>
            </div>
            <div>
              <div className="hidden lg:flex justify-end  items-center w-full font-bold text-xl">
                <div className="flex justify-center gap-x-3 items-center">
                  <div className="w-full flex justify-center items-center gap-x-3">
                    <p>My Multiplier</p>
                    <p>10x</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="md:rounded-3xl rounded-md  bg-button-primary px-3 py-1 text-lg font-normal">
                        claim
                      </button>
                    </DialogTrigger>
                    {<ClaimModal />}
                  </Dialog>
                </div>
              </div>
            </div>
          </TabsList>
          <TabsContent value="Staking">
            <div className="md:px-7 px-3 py-5 ">
              <div className="flex justify-start items-center text-2xl font-bold gap-x-3 w-32 py-1 border-b-2 border-primary">
                <Image
                  src="/assets/Vector.png"
                  alt="staking Image"
                  width={28}
                  height={28}
                />
                <p>Staking</p>
              </div>
              <div className="grid grid-col-1 gap-x-2 lg:flex lg:justify-start pt-5 text-base font-normal">
                <p>
                  Staking lets your assets work for you. Securely lock and earn
                  rewards effortlessly. Join the future of passive income now!
                </p>
                <Link
                  href=""
                  className="flex justify-start items-center gap-x-2 text-primary"
                >
                  View Whitepaper
                  <Image
                    src="/assets/ungroup.png"
                    alt="linkImage"
                    width={20}
                    height={20}
                  />
                </Link>
              </div>
              <div className="divide-y divide-solid divide-border">
                <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-x-10 gap-x-2 py-4  lg:divide-x-2 divide-border">
                  <div>
                    <OverviewCard />
                  </div>
                  <div className="">
                    <StakeCard />
                  </div>
                </div>
                <div>
                  <StakePbtCard />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="Position Mining">
            <div>
              <PositionMiningCard />
            </div>
          </TabsContent>
          <TabsContent value="Liquidity Mining">
            <div className="">{}</div>
            {Titles.map((item, index) => (
              <LMiningAndPFiler key={index} title={Titles} data={Data} />
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
