"use client";

import { TabsList, Tabs, TabsTrigger, TabsContent } from "../ui/tabs";
import PositionMiningCard from "./positionMiningCard";
export default function PositionHistoryCard() {
  return (
    <div className="px-9 py-5 text-gray-500 font-normal text-lg">
      <hr className="py-3 border-gray-700" />
      <div className="flex space-x-4 text-lg font-bold">
        <div className="text-primary">Position</div>
        <div className="">History</div>
      </div>
      {/* <div className="lg:flex lg:justify-between lg:items-center grid grid-cols-1 gap-y-3 text-lg font-normal">
        <div className="hidden md:grid grid-cols-1 gap-y-2">
          <p>Liquidity</p>

          <div className="grid grid-cols-1 gap-y-2">
            <p>2000.00</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-1 grid-cols-2 pt-2 md:pt-0 gap-y-2">
          <p>Leverage</p>
          <div className="grid grid-cols-1 gap-y-2">
            <p className="text-end md:text-start">200x</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-1 grid-cols-2 gap-y-2">
          <p>Unrealized PnL</p>
          <div className="grid grid-cols-1 gap-y-2 gap-x-2 text-semantic-success">
            <div className="flex md:justify-start justify-end items-center text-semantic-success gap-x-2">
              <p>120.20</p>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-1 grid-cols-2 gap-y-2 ">
          <p>Risk</p>
          <div className="grid grid-cols-1 gap-y-2 gap-x-2 ">
            <div className="flex md:justify-start justify-end items-center gap-x-2">
              <p>93.95%</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-1 grid-cols-2 gap-y-2 ">
          <p>Margin</p>
          <div className="grid grid-cols-1 gap-y-2">
            <div className="flex md:justify-start justify-end items-center gap-x-2">
              <p className="text-start">993.12</p>
              <p className="text-start">USDC</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:grid grid-rows-2 gap-y-4 text-base font-normal">
          <button className="lg:rounded-3xl rounded-md  bg-button-primary px-2 py-1  ">
            Remove
          </button>
        </div>
      </div> */}
      <div className="grid grid-cols-6 place-items-start mt-4 text-center text-sm">
        <div>
          <div className="">Liquidity</div>
          <div className="text-white pt-3">2000.00</div>
        </div>
        <div>
          <div className="">Leverage</div>
          <div className="text-white pt-3">200x</div>
        </div>
        <div>
          <div className="">Unrealized PnL</div>
          <div className="text-semantic-success pt-3">120.20</div>
        </div>
        <div>
          <div className="text-gray-500">Risk</div>
          <div className="flex items-center justify-center pt-3 text-white">
            93.95%
          </div>
        </div>
        <div>
          <div className="text-gray-500">Margin</div>
          <div className="text-white pt-3">993.12 USDC</div>
        </div>
        <div className="flex items-center justify-center">
          <button className="px-5 py-2 border rounded-lg">Remove</button>
        </div>
      </div>
    </div>
  );
}
