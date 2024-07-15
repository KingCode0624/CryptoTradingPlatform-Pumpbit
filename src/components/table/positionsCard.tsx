"use client";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../models";
import AddTpslModal from "../models/AddTpslModal";
import TpslSettingModal from "../models/tpslSettingModal";

export default function PositionsCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full p-7">
        <div className="sm:flex sm:justify-start items-baseline gap-10 grid grid-cols-3">
          <h2 className="font-medium sm:text-2xl text-xl">BTC/USDC</h2>
          <p className="font-medium sm:text-xl text-base text-semantic-success">
            Long 50x
          </p>
          <p className="font-medium sm:text-xl text-base ">63.95%</p>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 py-3">
          <div className="">
            <p className="text-text-secondary text-lg">
              Size <span className="block sm:inline text-white">0.471 BTC</span>
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Entry Price{" "}
              <span className="block sm:inline text-white">41030.29</span>
            </p>
          </div>
          <div>
            <p className="text-text-secondary ">
              Unrealized PNL{" "}
              <span className="block sm:inline text-semantic-success md:text-lg text-xs">
                +100.83(+11.32)
              </span>
            </p>
          </div>
          <div className="flex col-span-full justify-end gap-2 order-last lg:order-none lg:col-span-1 ">
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-4 py-1 rounded-full border-2">
                  TP/SL
                </button>
              </DialogTrigger>
              {<TpslSettingModal setIsModalOpen={setIsModalOpen} />}
            </Dialog>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              {<AddTpslModal />}
            </Dialog>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Margin{" "}
              <span className="block sm:inline text-white">993.12 USDC</span>
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Liq. Price{" "}
              <span className="block sm:inline text-white">39973.59</span>
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-lg">
              Net Funcding{" "}
              <span className="block sm:inline text-semantic-danger">
                -1.13
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
