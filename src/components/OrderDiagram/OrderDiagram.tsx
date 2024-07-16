"use client";
import React, { useState } from "react";

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
// import TPSLInput from "@/components/OrderDiagram/TPSLInput";
// import { state, market, usdtMint } from "@/components/Constant";
// import LeverageSlider from "@/components/LeverageSlider";

// import useNumberInput from "@/hooks/useNumberInput";
// import { type InftyDex, IDL } from "@/idl/infty_dex";
// import * as InftyDexJson from "@/idl/infty_dex.json";
// import type { PairInfo } from "@/lib/types";
import { getMarketInfo } from "@/services/markets";

interface OrderDiagramProps {
  selectedPair: any;
}

export default function OrderDiagram({ selectedPair }: OrderDiagramProps) {
  const [selectedSide, setSelectedSide] = useState("Long");
  const [selectedOrderType, setSelectedOrderType] = useState("Market");

  const [leverage, setLeverage] = useState<number>(1);

  const handleLeverageChange = (value: number) => {
    setLeverage(value);
    console.log("Leverage:", value);
  };

  //   const [marketPrice, setMarketPrice] = useState(0);
  //   const {
  //     value: limitPrice,
  //     handleChange: handleLimitPriceChange,
  //     handleBlur: handleLimitPriceBlur,
  //   } = useNumberInput("0.00");
  //   const {
  //     value: tpPrice,
  //     handleChange: handleTpPriceChange,
  //     handleBlur: handleTpPriceBlur,
  //   } = useNumberInput("");
  //   const {
  //     value: slPrice,
  //     handleChange: handleSlPriceChange,
  //     handleBlur: handleSlPriceBlur,
  //   } = useNumberInput("");
  //   const {
  //     value: quoteAmount,
  //     handleChange: handleQuoteAmountChange,
  //     handleBlur: handleQuoteAmountBlur,
  //     setValueDirectly: setQuoteAmount,
  //   } = useNumberInput("0.00");

  //   const [program, setProgram] = useState<anchor.Program<InftyDex>>();
  //   const { connection } = useConnection();
  //   const wallet = useAnchorWallet();
  //   useEffect(() => {
  //     let provider: anchor.Provider;
  //     if (!wallet) return;
  //     try {
  //       provider = anchor.getProvider();
  //     } catch {
  //       provider = new anchor.AnchorProvider(connection, wallet, {});
  //       anchor.setProvider(provider);
  //     }

  //     const program = new anchor.Program<InftyDex>(
  //       IDL,
  //       InftyDexJson.metadata.address,
  //       provider,
  //     );
  //     setProgram(program);
  //   }, [connection, wallet]);

  //   const [selectedLeverage, setSelectedLeverage] = useState(1);
  const [checked, setChecked] = useState(false);
  //   //eslint-disable-next-line
  const handleCheckboxChange = (event: any) => {
    setChecked(!checked);
  };

  const handleSideSelection = (side: string) => {
    setSelectedSide(side);
  };

  const handleTypeSelection = (type: string) => {
    setSelectedOrderType(type);
  };

  //   const [balance, setBalance] = useState(0);
  //   useEffect(() => {
  //     if (!wallet) return;
  //     const userAta = getAssociatedTokenAddressSync(usdtMint, wallet.publicKey);
  //     const fetchBalance = async () => {
  //       const balance = await connection.getTokenAccountBalance(userAta);
  //       if (balance.value.uiAmount) {
  //         setBalance(balance.value.uiAmount);
  //         console.log("balance", balance.value.uiAmount);
  //       }
  //     };
  //     fetchBalance();
  //     //eslint-disable-next-line
  //   }, [wallet, connection, program]);
  //   const openPosition = async (side: boolean) => {
  //     if (!program || !wallet) return;
  //     const userPDA = PublicKey.findProgramAddressSync(
  //       [Buffer.from("user"), wallet.publicKey.toBuffer()],
  //       program.programId,
  //     )[0];
  //     console.log("userPDA", userPDA.toBase58());
  //     //get userdata from pda
  //     await program.account.user.fetch(userPDA).catch(async () => {
  //       const name = "Usermame";
  //       // Ensure the name is padded or trimmed to exactly 32 bytes
  //       let nameBuffer = Buffer.from(name);
  //       if (nameBuffer.length < 32) {
  //         nameBuffer = Buffer.concat([
  //           nameBuffer,
  //           Buffer.alloc(32 - nameBuffer.length),
  //         ]);
  //       } else if (nameBuffer.length > 32) {
  //         nameBuffer = nameBuffer.slice(0, 32);
  //       }
  //       // Convert the buffer to an array of unsigned 8-bit integers
  //       const nameArray = Array.from(nameBuffer);
  //       const txid = await program.methods
  //         .initializeUser(nameArray)
  //         .accounts({
  //           userKey: wallet.publicKey,
  //           systemProgram: anchor.web3.SystemProgram.programId,
  //         })
  //         .rpc({ skipPreflight: true });
  //       console.log("InitializeUser tx:", txid);
  //     });
  //     const user = await program.account.user.fetch(userPDA);
  //     console.log("user", user);
  //     const numOfPosition = user.nextIncreasePositionId;
  //     const numOfOrder = user.nextOrderId;
  //     const orderU32 = new BN(numOfOrder);
  //     console.log("numOfPosition", numOfPosition);
  //     const thisU32 = new BN(numOfPosition);
  //     const increasePDA = PublicKey.findProgramAddressSync(
  //       [
  //         Buffer.from("increase_position"),
  //         wallet.publicKey.toBuffer(),
  //         thisU32.toArrayLike(Buffer, "le", 4),
  //       ],
  //       program.programId,
  //     )[0];
  //     console.log("increasePDA", increasePDA.toBase58());
  //     const userAta = getAssociatedTokenAddressSync(usdtMint, wallet.publicKey);

  //     //console.log("userAta", userAta.toBase58());
  //     const vault = getAssociatedTokenAddressSync(usdtMint, increasePDA, true);
  //     // change xx.xx string to number * 10^8 to integer
  //     const quoteAmountNum = Number(quoteAmount) * 10 ** 8;
  //     console.log("quoteAmountNum", quoteAmountNum);
  //     const size = quoteAmountNum * selectedLeverage;
  //     console.log("size", size);
  //     const price = marketPrice * 10 ** 8;
  //     if (selectedOrderType === "Limit") {
  //       if (!limitPrice) {
  //         alert("Please input limit price");
  //         return;
  //       }
  //       const increaseOrderPDA = PublicKey.findProgramAddressSync(
  //         [
  //           Buffer.from("increase_order"),
  //           wallet.publicKey.toBuffer(),
  //           orderU32.toArrayLike(Buffer, "le", 4),
  //         ],
  //         program.programId,
  //       )[0];
  //       console.log("increaseOrderPDA", increaseOrderPDA.toBase58());
  //       const orderVault = getAssociatedTokenAddressSync(
  //         usdtMint,
  //         increaseOrderPDA,
  //         true,
  //       );
  //       const limitPriceNumber = Number(limitPrice) * 10 ** 8;
  //       if (side && limitPriceNumber >= price) {
  //         alert("Limit price should be lower than market price");
  //         return;
  //       }
  //       if (!side && limitPriceNumber <= price) {
  //         alert("Limit price should be higher than market price");
  //         return;
  //       }
  //       const txid = await program.methods
  //         .createIncreaseOrder(
  //           side,
  //           new BN(quoteAmountNum),
  //           new BN(size),
  //           new BN(limitPriceNumber),
  //           true,
  //         )
  //         .accounts({
  //           increaseOrderRequest: increaseOrderPDA,
  //           state: state,
  //           market: market,
  //           user: userPDA,
  //           usdtMint: usdtMint,
  //           userAta: userAta,
  //           vault: orderVault,
  //           userKey: wallet.publicKey,
  //           associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //           tokenProgram: TOKEN_PROGRAM_ID,
  //           systemProgram: SystemProgram.programId,
  //         })
  //         .rpc();
  //       console.log("createIncreaseOrder", txid);
  //       return;
  //     } else {
  //       await program.methods
  //         .createIncreasePosition(
  //           side,
  //           new BN(quoteAmountNum),
  //           new BN(size),
  //           new BN(price),
  //         )
  //         .accounts({
  //           increasePositionRequest: increasePDA,
  //           state: state,
  //           market: market,
  //           user: userPDA,
  //           usdtMint: usdtMint,
  //           userAta: userAta,
  //           vault: vault,
  //           userKey: wallet.publicKey,
  //           associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //           tokenProgram: TOKEN_PROGRAM_ID,
  //           systemProgram: SystemProgram.programId,
  //         })
  //         .rpc();
  //     }
  //   };
  // const openShort = async () => {
  //   openPosition(false);
  // };
  // const openLong = async () => {
  //   openPosition(true);
  // };

  //   useEffect(() => {
  //     if (!selectedPair.market) return;
  //     const interval = setInterval(async () => {
  //       const marketInfo = await getMarketInfo(selectedPair.market);
  //       if (marketInfo) {
  //         setMarketPrice(marketInfo.price);
  //       }
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }, [selectedPair.market]);

  return (
    <div className="">
      <div className="flex flex-col gap-y-6 rounded-3xl border border-border bg-card backdrop-blur-lg/2  p-5 ">
        <div className="flex w-full flex-row text-xl font-bold border border-secondary rounded-full">
          <button
            className={`px-15 w-1/2 py-3 ${
              selectedSide === "Long"
                ? "bg-semantic-success"
                : "bg-secondary text-p-light"
            } rounded-s-full rounded-r-xl`}
            onClick={() => handleSideSelection("Long")}
          >
            <div className="flex flex-row items-center justify-center gap-x-1 font-bold">
              {/* <ArrowUpIcon className="h-5 w-5" /> */}
              Long
            </div>
          </button>
          <button
            className={`px-15 w-1/2 py-3 ${
              selectedSide === "Short"
                ? "bg-semantic-danger"
                : "bg-secondary text-p-light"
            } rounded-e-full`}
            onClick={() => handleSideSelection("Short")}
          >
            <div className="flex flex-row items-center justify-center gap-x-1 font-bold">
              {/* <ArrowDownIcon className="h-5 w-5" /> */}
              Short
            </div>
          </button>
        </div>
        <div className="flex flex-row gap-x-5 text-xl font-bold">
          <button
            className={`text-lg font-bold ${
              selectedOrderType === "Market"
                ? "underline underline-offset-4"
                : ""
            }`}
            onClick={() => handleTypeSelection("Market")}
          >
            Market
          </button>
          <button
            className={`text-lg font-bold ${
              selectedOrderType === "Limit"
                ? "underline underline-offset-4"
                : ""
            }`}
            onClick={() => handleTypeSelection("Limit")}
          >
            Limit
          </button>
          {/* <button className="ml-auto flex flex-row gap-x-1 rounded-full border border-s-lighter px-3 py-1 text-s-lighter">
          <StarIcon />
          AI Risk Manager
        </button> */}
        </div>
        <div className="flex flex-col gap-y-3">
          {selectedOrderType === "Limit" && (
            <div className="rounded-3xl border border-p-light bg-secondary p-5">
              <div className="flex flex-col gap-y-6">
                <div className="flex flex-row">
                  <p>Price</p>
                  {/* <p className="ml-auto text-sm">Current:{marketPrice}</p> */}
                </div>
                <div className="flex items-center justify-between gap-x-5">
                  <input
                    className=" bg-inherit text-lg font-bold w-full"
                    //   value={limitPrice}
                    //   onChange={handleLimitPriceChange}
                    //   onBlur={handleLimitPriceBlur}
                    placeholder="Market Price"
                    step="0.01"
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
                {/* <p className="ml-auto text-sm">Balance:{balance}</p> */}
              </div>
              <div className="flex w-full flex-row items-center gap-x-5">
                <input
                  className="w-full bg-inherit text-lg font-bold "
                  // value={quoteAmount}
                  // onChange={handleQuoteAmountChange}
                  // onBlur={handleQuoteAmountBlur}
                  placeholder="Quote Amount"
                  step="0.01"
                />
                <p className="text-lg font-bold">{selectedPair.quote}</p>
                <button
                  className="rounded-3xl border border-p-light bg-button-primary px-3 py-1 text-lg font-normal"
                  // onClick={() => setQuoteAmount(balance)}
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
                {/* <p className="ml-auto text-sm">Leverage: {selectedLeverage}X</p> */}
              </div>
              <div className="flex flex-row items-center gap-x-5">
                <p className="mr-auto text-lg font-bold">
                  {/* {selectedOrderType === "Limit"
                  ? (Number(limitPrice)
                      ? (Number(quoteAmount) / Number(limitPrice)) *
                        selectedLeverage
                      : 0
                    ).toFixed(6)
                  : (
                      (Number(quoteAmount) / marketPrice) *
                      selectedLeverage
                    ).toFixed(6)} */}
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
          {/* <SliderRoot step={10} min={1} max={100} defaultValue={[30]}>
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb />
          </SliderRoot> */}

          <LeverageSlider
            onLeverageChange={handleLeverageChange}
            leverage={leverage}
          />
        </div>

        <hr className=" h-[1px] border-t-0 bg-gray-600 opacity-100 dark:opacity-50 " />

        <div className="flex flex-col gap-y-3">
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">Entry Price</p>
            {/* <p>{marketPrice}</p> */}
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">Pric Impact</p>
            <p className="text-red-600">-0.01%</p>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">Liq. Price</p>
            <div className="flex flex-row gap-x-1">
              {/* <p>{(marketPrice * (1 - 1 / selectedLeverage)).toFixed(4)}</p> */}
              <p>{selectedPair.quote}</p>
            </div>
          </div>
          <div className="flex flex-row">
            <p className="mr-auto text-p-light">Est. Margin</p>
            <div className="flex flex-row gap-x-1">
              {/* <p>{(marketPrice * (1 - 1 / selectedLeverage)).toFixed(4)}</p> */}
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
          className={`px-15 rounded-3xl text-lg font-bold ${
            selectedSide === "Long"
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
