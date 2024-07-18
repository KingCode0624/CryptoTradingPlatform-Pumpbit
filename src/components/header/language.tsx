import { BsThreeDots } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GrLanguage } from "react-icons/gr";
export const LanguageMenu = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <GrLanguage className="h-10 w-6 " />
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 border-0  w-32   ">
        <div className="   right-0  background-menu  rounded-md ">
          <div className=" text-p-lighter">
            <button className="w-full text-left  hover:bg-[#18191F] hover:text-primary  px-4 py-2">
              <div className="flex flex-row px-1 py-2">English</div>
            </button>
            <button className="w-full text-left text-gray-400 px-4 py-2">
              <div className="flex flex-row px-1 py-2">简体中文</div>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
