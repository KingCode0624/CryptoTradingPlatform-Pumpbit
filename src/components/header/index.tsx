"use client";
import Image from "next/image";
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import WalletButton from "@/components/walletButton";
import { RxCross1 } from "react-icons/rx";
import { AiFillCaretRight } from "react-icons/ai";
import SettingMobileMenu from "@/components/header/settingMobileMenu";
import LanguageMobileMenu from "@/components/header/languageMobileMenu";
import { MenuMore } from "./menuMore";
import { LanguageMenu } from "./language";
import { ChainMenu } from "./chainMenu";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { usePathname } from "next/navigation";
export default function Header() {
  const pathname = usePathname();
  let paths = [
    { name: "Trade", link: "/trade" },
    { name: "Earn", link: "/earn" },
  ];
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full fixed top-0 left-0">
      <div className="flex gap-x-10 md:gap-x-3 items-center relative  md:justify-between   py-4 md:px-10 pl-2">
        <div
          className="cursor-pointer flex items-center
       "
        >
          <Image
            className="w-36 lg:w-44"
            src={"/assets/Logo_White.png"}
            width={300}
            height={60}
            alt="logo"
          />

          <div className=" py-6 md:flex md:pl-4 lg:pl-48 hidden   ">
            {paths.map((path) => (
              <div key={path.name}>
                <div className="  text-[#b1b6be] active:text-white   visited:text-white  flex justify-between  gap-y-2 px-3 text-xl   ">
                  {" "}
                  <a
                    href={path.link}
                    className={`${
                      pathname === path.link ? "text-white" : "text-[#b1b6be]"
                    }`}
                  >
                    {path.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Popover>
          <PopoverTrigger className="text-3xl absolute right-2 top-5   cursor-pointer md:hidden">
            <GiHamburgerMenu />
          </PopoverTrigger>

          <PopoverContent className="w-screen border-none -translate-y-20 ">
            <div
              className={`md:items-center md:pb-0 fixed bg-gradient-bg  z-10 left-0 w-full md:w-auto md:hidden  transition-all duration-500 ease-in`}
            >
              <div className=" flex md:hidden justify-between  items-center px-3 pt-8 ">
                <Image
                  className="w-28"
                  src={"/assets/Logo_White.png"}
                  width={300}
                  height={60}
                  alt="logo"
                />
                <PopoverClose>
                  <RxCross1 className=" text-xl text-white" />
                </PopoverClose>
              </div>
              <hr className=" mt-6" />
              <div className=" my-8 flex flex-col md:flex-row gap-y-4">
                {paths.map((path) => (
                  <div key={path.name}>
                    <div className=" flex justify-between gap-y-2 px-3 text-xl  ">
                      {" "}
                      <a
                        href={path.link}
                        className={`${
                          pathname === path.link
                            ? "text-white"
                            : "text-[#b1b6be]"
                        }`}
                      >
                        {path.name}
                      </a>
                      <AiFillCaretRight className=" md:hidden" />
                    </div>
                  </div>
                ))}
              </div>

              <hr className="md:hidden" />
              <div className="md:hidden ">
                <SettingMobileMenu />
              </div>

              <div className="md:hidden ">
                <LanguageMobileMenu />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className=" flex gap-x-2 ">
          <div className="flex gap-x-2 items-center pr-10 md:flex-row-reverse">
            {/* <ChainMenu /> */}
            <ConnectButton />
          </div>
          <div className="hidden md:flex gap-x-4 items-center ">
            <LanguageMenu />
            <MenuMore />
          </div>
        </div>
      </div>
    </section>
  );
}
