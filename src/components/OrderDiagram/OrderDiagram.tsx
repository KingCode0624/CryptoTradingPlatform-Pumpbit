"use client";
import React, { useEffect, useState } from "react";

// import * as anchor from "@coral-xyz/anchor";
// import { BN } from "@coral-xyz/anchor";
// import Checkbox from "@mui/material/Checkbox";

// import {
//   ASSOCIATED_TOKEN_PROGRAM_ID,
//   TOKEN_PROGRAM_ID,
//   getAssociatedTokenAddressSync,
// } from "@solana/spl-token";
// import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
// import { PublicKey, SystemProgram } from "@solana/web3.js";

import ArrowDownIcon from "/public/assets/arrow-trending-down.svg";
import ArrowUpIcon from "/public/assets/arrow-trending-up.svg";
import {
  SliderRoot,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "../ui/slider";
import TPSLInput from "./TPSLInput";
import { Checkbox } from "../ui/checkbox";
import LeverageSlider from "../ui-custom/leverage-slider";
import { useUtilContext } from "@/hooks";
interface OrderDiagramProps {
  selectedPair: any;
}

export default function OrderDiagram({ selectedPair }: OrderDiagramProps) {

  const { ethPrice } = useUtilContext()

  const [selectedSide, setSelectedSide] = useState("Long");
  const [selectedOrderType, setSelectedOrderType] = useState("Market");

  const [leverage, setLeverage] = useState<number>(1);
  const [orderPay, setOrderPay] = useState<number>(0)
  const [estimatedEth, setEstimatedEth] = useState<number>(0)
  const [currentEthPrice, setCurrentEthPrice] = useState<number>(0)
  const [entryPrice, setEntryPrice] = useState<number>(0)
  const [liquidityPrice, setLiquidityPrice] = useState<number>(0)


  useEffect(() => {
    setCurrentEthPrice(ethPrice.close)
  }, [ethPrice])

  const handleLeverageChange = (value: number) => {
    setLeverage(value);
  };


  const [checked, setChecked] = useState(false);
  const handleCheckboxChange = (event: any) => {
    setChecked(!checked);
  };

  const handleSideSelection = (side: string) => {
    setSelectedSide(side);
  };

  const handleTypeSelection = (type: string) => {
    setSelectedOrderType(type);
  };

  const setEntryPriceInMarket = (entryPrice: number) => {
    setEntryPrice(entryPrice)
  }

  useEffect(() => {
    setEstimatedEth(orderPay * leverage / currentEthPrice)

    if (selectedOrderType === "Market")
      setEntryPriceInMarket(currentEthPrice)
  }, [leverage, currentEthPrice, orderPay,])




  return (
    <div className="">
      <div className="flex flex-col gap-y-6 rounded-3xl border border-border bg-card backdrop-blur-lg/2  p-5 ">
        <div className="flex w-full flex-row text-xl font-bold border border-secondary rounded-full">
          <button
            className={`px-15 w-1/2 py-3 ${selectedSide === "Long"
              ? "bg-semantic-success"
              : "bg-secondary text-p-light"
              } rounded-s-full rounded-r-xl`}
            onClick={() => handleSideSelection("Long")}
          >
            <div className="flex flex-row items-center justify-center gap-x-1 font-bold">
              Long
            </div>
          </button>
          <button
            className={`px-15 w-1/2 py-3 ${selectedSide === "Short"
              ? "bg-semantic-danger"
              : "bg-secondary text-p-light"
              } rounded-e-full`}
            onClick={() => handleSideSelection("Short")}
          >
            <div className="flex flex-row items-center justify-center gap-x-1 font-bold"
              onClick={() => { handleTypeSelection("Limit") }}
            >
              Short
            </div>
          </button>
        </div>
        <div className="flex flex-row gap-x-5 text-xl font-bold">
          <button
            className={`text-lg font-bold ${selectedOrderType === "Market"
              ? "underline underline-offset-4"
              : ""
              }`}
            onClick={() => {
              handleTypeSelection("Market")
              setEntryPrice(currentEthPrice)
            }}
          >
            Market
          </button>
          <button
            className={`text-lg font-bold ${selectedOrderType === "Limit"
              ? "underline underline-offset-4"
              : ""
              }`}
            onClick={() => {
              handleTypeSelection("Limit")
              setEntryPrice(0)
            }}
          >
            Limit
          </button>
        </div>
        <div className="flex flex-col gap-y-3">
          {selectedOrderType === "Limit" && (
            <div className="rounded-3xl border border-p-light bg-secondary p-5">
              <div className="flex flex-col gap-y-6">
                <div className="flex flex-row">
                  <p>Price</p>
                </div>
                <div className="flex items-center justify-between gap-x-5">
                  <input
                    className=" bg-inherit text-lg font-bold w-full"
                    placeholder="Market Price"
                    step="0.01"
                    onChange={(e: any) => {
                      setEntryPrice(e.target.value)
                    }}
                  />
                  <p className="text-lg font-bold">{selectedPair.quote}</p>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-3xl border border-p-light bg-secondary p-5">
            <div className="flex flex-col gap-y-6">
              <div className="flex flex-row">
                <p>Pay</p>
              </div>
              <div className="flex w-full flex-row items-center gap-x-5">
                <input
                  className="w-full bg-inherit text-lg font-bold "
                  placeholder="Quote Amount"
                  step="0.01"
                  onChange={(e: any) => {
                    setOrderPay(e.target.value)
                  }}
                />
                <p className="text-lg font-bold">{selectedPair.quote}</p>
                <button
                  className="rounded-3xl border border-p-light bg-button-primary px-3 py-1 text-lg font-normal"
                >
                  Max
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-p-light bg-secondary p-5">
            <div className="flex flex-col gap-y-6">
              <div className="flex flex-row">
                <p>Size</p>
              </div>
              <div className="flex flex-row items-center gap-x-5">
                <p className="mr-auto text-lg font-bold">
                  {estimatedEth}
                </p>
                <p className="text-lg font-bold">{selectedPair.base}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-row">
            <p className="mr-auto leading-relaxed">Leverage Slider</p>
            <p className="text-lg font-bold">{leverage}X</p>
          </div>
          <LeverageSlider
            onLeverageChange={handleLeverageChange}
            leverage={leverage}
          />
        </div>

        <hr className=" h-[1px] border-t-0 bg-gray-600 opacity-100 dark:opacity-50 " />

        <div className="flex flex-col gap-y-3">
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">Entry Price</p>
            <p>{entryPrice}</p>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">Pric Impact</p>
            <p className={`${liquidityPrice >= 0 ? "text-p-light" : "text-red-600"}`}>{liquidityPrice + "%"}</p>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">Liq. Price</p>
            <div className="flex flex-row gap-x-1">
              <p>{selectedPair.quote}</p>
            </div>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">Est. Margin</p>
            <div className="flex flex-row gap-x-1">
              <p>{orderPay}</p>
              <p>{selectedPair.quote}</p>
            </div>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">Fees</p>
            <div className="flex flex-row gap-x-1">
              <p>
                {/* {(
                (Number(quoteAmount) / marketPrice) *
                selectedLeverage *
                0.0005
              ).toFixed(6)} */}
              </p>
              <p>{selectedPair.quote}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-x-2">
            {/* <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "white",
                  }}
                />
              }
              onChange={handleCheckboxChange}
              label="TP/SL"
            />
          </FormGroup> */}
            <Checkbox
              className="bg-inherit rounded"
              onClick={handleCheckboxChange}
              name="TP/SL"
            />
            <label> TP/SL</label>
            {/* <button className="ml-auto flex flex-row items-center gap-x-1 text-s-light">
            <ChipIcon className="h-6 w-6" />
            <p>RiskGuard AI</p>
          </button> */}
          </div>

          {checked && (
            <div className="mt-5 flex flex-row items-center justify-center gap-x-3">
              <TPSLInput
                //  value={tpPrice}
                //  onChange={handleTpPriceChange}
                // onBlur={handleTpPriceBlur}
                placeholder="TP Price"
              />
              <TPSLInput
                //  value={slPrice}
                //  onChange={handleSlPriceChange}
                // onBlur={handleSlPriceBlur}
                placeholder="SL Price"
              />
            </div>
          )}
        </div>
        <button
          className={`px-15 rounded-3xl text-lg font-bold ${selectedSide === "Long"
            ? "bg-semantic-success"
            : "bg-semantic-danger"
            } py-3`}
        // onClick={selectedSide === "Long" ? openLong : openShort}
        >
          {selectedSide === "Long" ? "Open Long" : "Open Short"}
        </button>
      </div>
    </div>
  );
}
