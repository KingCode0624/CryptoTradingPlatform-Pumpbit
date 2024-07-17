"use client"
import { Authorization } from "@/authorization"
import { useUtilContext } from "@/hooks"
import { useWeb3 } from "@/hooks"
import { useEffect } from "react"

const Admin = () => {
    const { accessToken } = useUtilContext()
    const {isConnected} = useWeb3()

    return (
        <div className='mt-[500px]'>
            <div>
                Hello
            </div>
            <button
                onClick={() => {

                }}
            >
                Click
            </button>
        </div>
    )
}

export default Admin