"use client"
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from ".";
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "../ui/slider";
import { useWeb3 } from "@/hooks";
export default function AddLiquidityModal() {

  const { account, usdcTokenContract } = useWeb3()

  const [accountBalance, setAccountBalance] = useState<number>(0)
  const [poolLiquidity, setPoolLiquidity] = useState<number>(0)
  const [poolSize, setPoolSize] = useState<number>(0)
  const [slider, setSlider] = useState<number[]>([1])
  const init = async () => {
    const _accountBalance = await usdcTokenContract.methods.balanceOf(account).call()
    setAccountBalance(Number(_accountBalance) / Math.pow(10, 18))
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    setPoolSize(poolLiquidity * slider[0])
  }, [poolLiquidity])

  const handleValueChange = (newValue: number[]) => {
    setSlider(newValue);
    setPoolSize(poolLiquidity * newValue[0])
  };


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
              <p className="ml-auto text-sm">Balance: {accountBalance}</p>
            </div>
            <div className="flex w-full items-center  justify-between gap-x-5">
              <div>
                <input className="text-white text-xl bg-transparent border-slate-500" value={poolLiquidity}
                  onChange={(e: any) => {
                    setPoolLiquidity(e.target.value)
                  }}
                />
              </div>
              <div className="flex gap-x-2 items-center">
                <p className="text-lg font-bold">USDC</p>
                <button className="rounded-3xl border border-border bg-card-secondary px-3 py-1 text-lg font-normal"
                  onClick={() => { setPoolLiquidity(accountBalance) }}
                >
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
              <p className="ml-auto text-sm">Leverage::{slider[0]}X</p>
            </div>
            <div className="flex w-full items-center  justify-between gap-x-5">
              <div>
                <p className="text-white text-xl">{poolSize}</p>
              </div>
              <div className=" ">
                <p className="text-lg font-bold">USDC</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-row">
            <p className="mr-auto leading-relaxed">Leverage Slider</p>
            <p className="text-lg font-bold"> {slider[0]}X</p>
          </div>
          <SliderRoot step={1} min={1} max={200} defaultValue={[30]}
            onValueChange={handleValueChange}
            value={slider}
          >
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb />
          </SliderRoot>
        </div>
        <div className="flex flex-col gap-y-3 mt-6">
          <div className="flex flex-row">
            <p className="mr-auto text-text-secondary">Liquidity</p>
            <p className="text-white-600 text-sm">{poolSize}</p>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-text-secondary">Margin</p>
            <p className="text-white-600 text-sm">{poolLiquidity}</p>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-text-secondary">Execution Fee</p>
            <div className="flex flex-row gap-x-1">
              <p className="text-white-600 text-sm">-0.00030 BTC($10.0)</p>
            </div>
          </div>
        </div>
        <div className="mt-1mb-2">
          <button className="py-2 w-full rounded-lg text-lg bg-primary font-bold"
            onClick={() => {
              init()
            }}
          >
            Add
          </button>
        </div>
      </DialogContent>
    </div>
  );
}
