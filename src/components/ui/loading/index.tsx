"use client"

import { useEffect, useState } from "react"

const Loading = () => {
    const [number, setNumber] = useState<number>(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setNumber(prev => prev + 1)
        }, 500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-[80px] flex gap-1">
            <div>Loading</div>
            <div className="">
                {
                    number % 4 == 0 ? "" :
                        number % 4 == 1 ? "." :
                            number % 4 == 2 ? ".." :
                                number % 4 == 3 ? "..." : ""
                }

            </div>
        </div>
    )
}

export default Loading