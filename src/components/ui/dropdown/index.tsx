import { MdArrowDropDown } from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";

export const MagicMenu = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative flex">
          <div className="flex flex-row gap-x-2">
            <Image
              src="/assets/token pair.png"
              alt="tokenPair"
              width={35}
              height={20}
            />
            BTC/USDC
          </div>
          <MdArrowDropDown className="h-6 w-6 " />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="absolute left-0 top-10 px-3 w-40 py-5 border-0 bg-popover z-10"
      >
        <div className="rounded-md  ">
          <div className="">
            <button className="w-full hover:bg-[#22193D] text-white hover:text-primary px-2 py-2">
              <div className="flex flex-row gap-x-2">
                <Image
                  src="/assets/token pair.png"
                  alt="tokenPair"
                  width={35}
                  height={20}
                />
                BTC/USDC
              </div>
            </button>
            <button
              className="w-full hover:bg-[#22193D] text-white hover:text-primary px-2 py-2 "
              disabled
            >
              <div className="flex flex-row gap-x-2">
                <Image
                  src="/assets/token_pair.png"
                  alt="tokenPair"
                  width={35}
                  height={20}
                />
                BTC/USDC
              </div>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
