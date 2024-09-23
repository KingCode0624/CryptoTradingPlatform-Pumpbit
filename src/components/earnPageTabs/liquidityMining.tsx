"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogTrigger } from "../models";
import AddLiquidityModal from "../models/addLiquidityModal";
import PositionHistoryCard from "./positionHistoryCard";
import { cn } from "@/lib/utils";
import { useUtilContext } from "@/hooks";
import { Lang_Add } from "@/constants/language";
import { useWeb3 } from "@/hooks";
import { toInt } from "@/utils/etcfunction";
import Loading from "../ui/loading";
import { getLiquidityPosition, getPool } from "@/services/markets";
import { chain, market } from "@/constants/index"
import { GiCardKingClubs } from "react-icons/gi";

type TableRowProps = {
  pool: string;
  maxAPR: number;
  feeIncome: number;
  dailyEmission: number;
  totalLiquidity: number;
  myLiquidity: number;
  claimableRewards: number;
  index: number;
  isOpen: boolean;
  toggleAccordion: (index: number) => void;
};

type TableRowType = {
  pool: string;
  maxAPR: number;
  feeIncome: number;
  dailyEmission: number;
  totalLiquidity: number;
  myLiquidity: number;
  claimableRewards: number;
  index: number;
  isOpen: boolean;
  toggleAccordion: (index: number) => void;
  liquidityIndex: number;
};

export const TableRow = (props: TableRowType) => {
  type PublicPoolType = {
    chain: '',
    pools: [
      {
        market: '',
        market_display: '',
        max_apr: '',
        fee_income: '',
        liquidity: '',
        balance_rate: ''
      }
    ]
  }

  type MyLiquidityPositionType = {
    chain: '',
    liquidity_positions: [
      {
        market: '',
        market_display: '',
        margin: '',
        liquidity: '',
        leverage: '',
        unrealized_pnl: ''
      }
    ]
  }

  const { language, intervalApiTimer } = useUtilContext()
  const { positionRouterContract, account, chainId } = useWeb3()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [expanded, setExpanded] = useState<boolean>(false)
  const [liquidityData, setLiquidityData] = useState<any>([]);
  const [myTotalLiquidity, setMyTotalLiquidity] = useState<number>(0)
  const [myLiquidityPosition, setMyLiquidityPosition] = useState<any>()
  const [publicPool, setPublicPool] = useState<PublicPoolType>()

  useEffect(() => {
    setIsLoading(false)
  }, [language])

  const GetLiquidityPosition = async () => {
    const accessToken: string = localStorage.getItem("accessToken") as string
    const poolResult = await getPool(accessToken, market, chain)
    await setPublicPool(poolResult.data)

    const _myLiquidityPosition = await getLiquidityPosition(accessToken, market, chain)
    await setMyLiquidityPosition(_myLiquidityPosition.data)

    let total_sum = 0
    for (let i = 0; i < length; i++) {
      total_sum += Number(_myLiquidityPosition.data.liquidity_positions[i].liquidity)
    }

    await setMyTotalLiquidity(Number(total_sum))

    await setLiquidityData(_myLiquidityPosition.data.liquidity_positions)
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await GetLiquidityPosition()
    }, 4000)
  }, [])

  if (isLoading)
    return (
      <div>
        Loading ....
      </div>
    )
  return (
    <>
      {" "}
      <tr className="w-full [&_td]:min-w-11  [&_td]:py-5 px-12">
        <td align="center">
          {
            localStorage.getItem("pair") === null ? "BTC/USDC" : localStorage.getItem("pair")
          }
        </td>
        <td align="center" className="text-semantic-success">
          <p>
            {
              publicPool && publicPool.pools.length > 0
                ? `${publicPool.pools[0].max_apr}`
                : "Loading"
            }
          </p>
        </td>
        <td align="center">
          {
            publicPool && publicPool.pools.length > 0
              ? `${publicPool.pools[0].fee_income}`
              : "Loading"
          }
        </td>
        <td align="center">
          {publicPool && publicPool.pools.length > 0
            ? `${publicPool.pools[0].liquidity} USDC`
            : "Loading"}
        </td>
        <td align="center">{myTotalLiquidity + "USDC"} </td>

        <td align="center">
          <button className="px-2 py-1" onClick={() => {
            setExpanded(!expanded)
          }}>
            <Image
              src="/assets/arrow_drop_down.png"
              alt="pool image"
              width={24}
              height={24}
            />
          </button>
        </td>
        <td align="center">
          <Dialog>
            <DialogTrigger asChild>
              <button className="lg:rounded-lg rounded-md bg-button-primary px-2 py-1"
              >
                {language === "EN" ? Lang_Add.en : Lang_Add.ch}
              </button>
            </DialogTrigger>
            <AddLiquidityModal />
          </Dialog>
        </td>
      </tr>
      <tr>
        <td colSpan={9}>
          <div
            className={cn("transition-all duration-300 overflow-hidden", {
              "max-h-screen ": expanded,
              "max-h-0 ": !expanded,
            })}
          >
            {
              liquidityData.map((item: any, idx: number) => (
                <PositionHistoryCard
                  key={idx}
                  liquidityData={liquidityData[idx]}
                  index={idx}
                />
              ))
            }

          </div>
        </td>
      </tr>
    </>
  );
};

type TableTitleProps = {
  title1: string;
  title2: string;
  title3: string;
  title4: string;
  title5: string;
};

export const TableTitles = (props: TableTitleProps) => {
  return (
    <tr className=" [&_th]:min-w-11  [&_th]:p-2 border-b border-solid border-[#ffffff33]">
      <th>{props.title1}</th>
      <th>{props.title2}</th>
      <th>{props.title3}</th>
      <th>{props.title4}</th>
      <th>{props.title5}</th>
    </tr>
  );
};

type TableProps = {
  data: Omit<TableRowProps, "index" | "isOpen" | "toggleAccordion">[];
  title: TableTitleProps[];
};

export const LMiningAndPFiler = (props: TableProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  if (!Array.isArray(props.data) || props.data.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center text-base text-[#FFF] font-normal lg:w-full">
      <div className="w-full rounded-2xl">
        <div>
          <table className="w-full">
            <thead>
              {props.title.map((items, index) => (
                <TableTitles {...items} key={index} />
              ))}
            </thead>
            <tbody>
              {props.data.map((item, index) => (
                <TableRow
                  {...item}
                  key={index}
                  index={index}
                  isOpen={openIndex === index}
                  toggleAccordion={toggleAccordion}
                  liquidityIndex={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
