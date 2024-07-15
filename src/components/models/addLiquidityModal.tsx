import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from ".";
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "../ui/slider";

export default function AddLiquidityModal() {
  return (
    <div>
      <DialogContent className=" bg-card-secondary flex flex-col gap-y-3 text-white  max-w-xl">
        <DialogTitle> Add Liquidity</DialogTitle>
        <div className=" mt-6">
          <div className="flex justify-between sm:gap-2  ">
            <div className="flex-1">
              <p className="text-text-secondary text-sm ">
                Pool
                <span className="block text-white text-sm font-semibold pt-2">
                  BTC/USD
                </span>
              </p>
            </div>
            <div className="flex-1">
              <p className="text-text-secondary">
                Max APR
                <span className="block text-semantic-success text-sm pt-2">
                  294.12%
                </span>
              </p>
            </div>
            <div className="flex-1">
              <p className="text-text-secondary text-sm">
                Total Liquidity
                <span className="block text-white text-sm pt-2">12.41M</span>
              </p>
            </div>
            <div className="flex-1">
              <p className="text-text-secondary text-base">
                24h Fee Income
                <span className="block text-white text-sm pt-2">893.23</span>
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-secondary p-5">
          <div className="flex flex-col gap-y-6">
            <div className="flex  justify-between">
              <p>Pay</p>
              <p className="ml-auto text-sm">Balance:1600:00</p>
            </div>
            <div className="flex w-full items-center  justify-between gap-x-5">
              <div>
                <p className="text-white text-xl">1000.00</p>
              </div>
              <div className="flex gap-x-2 items-center">
                <p className="text-lg font-bold">USDT</p>
                <button className="rounded-3xl border border-border bg-card-secondary px-3 py-1 text-lg font-normal">
                  Max
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-secondary p-5">
          <div className="flex flex-col gap-y-6">
            <div className="flex  justify-between">
              <p>size</p>
              <p className="ml-auto text-sm">Leverage::20X</p>
            </div>
            <div className="flex w-full items-center  justify-between gap-x-5">
              <div>
                <p className="text-white text-xl">1000.00</p>
              </div>
              <div className=" ">
                <p className="text-lg font-bold">USDT</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-row">
            <p className="mr-auto leading-relaxed">Leverage Slider</p>
            <p className="text-lg font-bold"> 20X</p>
          </div>
          <SliderRoot step={10} min={1} max={100} defaultValue={[30]}>
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb />
          </SliderRoot>
        </div>
        <div className="flex flex-col gap-y-3 mt-6">
          <div className="flex flex-row">
            <p className="mr-auto text-text-secondary">Liquidity</p>
            <p className="text-white-600 text-sm">2000.01</p>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-text-secondary">Margin</p>
            <p className="text-white-600 text-sm">100.01</p>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-text-secondary">Execution Fee</p>
            <div className="flex flex-row gap-x-1">
              <p className="text-white-600 text-sm">-0.00030 BTC($10.0)</p>
            </div>
          </div>
        </div>
        <div className="mt-1mb-2">
          <button className="py-2 w-full rounded-lg text-lg bg-primary font-bold">
            Add
          </button>
        </div>
      </DialogContent>
    </div>
  );
}
