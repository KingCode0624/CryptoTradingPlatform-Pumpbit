"use client"

import { useEffect } from "react"

interface PercentType {
    percent: number,
}
const RectProgressBar = ({ percent }: PercentType) => {
    return (
        <div className="w-[50px] h-[20px] flex justify-center items-center gap-1">
            <div className={`w-[2px] rounded-xl h-[15px] ${percent / 20 >= 1 ? "bg-semantic-success" : "bg-[#b4b3b5]"}`}></div>
            <div className={`w-[2px] rounded-xl h-[15px] ${percent / 20 >= 2 ? "bg-semantic-success" : "bg-[#b4b3b5]"}`}></div>
            <div className={`w-[2px] rounded-xl h-[15px] ${percent / 20 >= 3 ? "bg-semantic-success" : "bg-[#b4b3b5]"}`}></div>
            <div className={`w-[2px] rounded-xl h-[15px] ${percent / 20 >= 4 ? "bg-semantic-success" : "bg-[#b4b3b5]"}`}></div>
            <div className={`w-[2px] rounded-xl h-[15px] ${percent / 20 >= 5 ? "bg-semantic-success" : "bg-[#b4b3b5]"}`}></div>
        </div>
    )
}
export default RectProgressBar