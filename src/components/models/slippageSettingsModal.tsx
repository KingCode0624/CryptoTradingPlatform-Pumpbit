import React from "react";
import { DialogContent, DialogTitle } from ".";

export default function SlippageSettingModal() {
  return (
    <div>
      <DialogContent className=" bg-gradient-bg  flex flex-col gap-y-3 text-white  max-w-md">
        <DialogTitle> Slippage Settings </DialogTitle>
        <div className=" mt-6">
          <div className=" flex flex-col ">
            <div className="border border-p-light bg-secondary p-2 rounded-lg">
              <div className="flex flex-col ">
                <div className="flex w-full items-center  justify-between ">
                  <div>
                    <p className="text-white text-sm">1000.00</p>
                  </div>
                  <div className="flex gap-x-2 items-center">
                    <p className="text-sm">300%</p>
                    <button className="rounded-3xl border border-border bg-card-secondary px-3 py-1 text-lg font-normal">
                      Auto
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-sm text-justify text-text-secondary">
                Once set, the slippage tolerance applies to all trades, except
                for a few specific cases. Importantly, the maximum allowable
                slippage tolerance should not exceed 5%.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 ">
          <button className="py-1.5 w-full rounded-full text-lg bg-primary font-bold">
            Confrim
          </button>
        </div>
      </DialogContent>
    </div>
  );
}
