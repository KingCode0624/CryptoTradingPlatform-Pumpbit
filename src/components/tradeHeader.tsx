"use client"
import Image from "next/image";
import { MagicMenu } from "./ui/dropdown";
import { useUtilContext } from "@/hooks";
import { useEffect, useState } from "react";
import { getMarketInfo } from "@/services/markets";
import { chain, market } from "@/constants/index"
import { cookieStorage } from "wagmi";
export default function TradeHeader() {

  const { ethPrice, headerPrice } = useUtilContext()

  const [changeDay, setChangeDay] = useState<string>("0%")

  const init = async () => {
    const result = await getMarketInfo(market, chain)
    const _changeDay = String(Number(result.change_in_24h).toFixed(2)) + "%"
    setChangeDay(_changeDay)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      init();
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  return (
    <div className="flex flex-col justify-around xl:flex-row py-4 backdrop-blur-lg/2 px-2 bg-card border border-border rounded-3xl">
      <div className="flex justify-between items-center sm:gap-12 gap-2">
        <div className="flex justify-between">
          {/* <Image
            src="/assets/token pair.png"
            alt="tokenPair"
            width={48}
            height={32}
          />
          <h1 className="font-bold text-2xl pl-2">BTC/USDC</h1> */}
          <MagicMenu />
        </div>
        <div>
          <p className="text-semantic-success font-bold sm:text-4xl text-sm ">
            {ethPrice ? String(Number(ethPrice.close).toFixed(2)) : "0"}
          </p>
        </div>
        <div>
          <p className="">
            <span className="text-text-secondary hidden lg:block">
              24h change
            </span>{" "}
            <span className="block  text-semantic-success text-lg">{changeDay}</span>
          </p>
        </div>
      </div>
      <div className="flex justify-between sm:gap-12 gap-2">
        <div>
          <p className="text-text-secondary">
            24h High <span className="block text-white text-lg">{Number(headerPrice.price24High).toFixed(2)}</span>
          </p>
        </div>
        <div>
          <p className="text-text-secondary">
            24h low <span className="block text-white text-lg">{Number(headerPrice.price24Low).toFixed(2)}</span>
          </p>
        </div>
        <div>
          <p className="text-text-secondary">Funding/Countdown </p>
          <p>
            {" "}
            <span className=" text-semantic-warning">0.00081% </span>
            <span className=" text-white text-lg">/ 00:29:51</span>
          </p>
        </div>
      </div>
    </div>
  );
}
