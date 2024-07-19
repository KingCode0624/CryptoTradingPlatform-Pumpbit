"use client"
import {
    useContext,
    createContext,
    useEffect,
    useCallback,
    useState,
    useMemo,
} from "react"
import { UtilContextType, EthPriceType, TradeHeaderType } from "@/types"
import { Authorization } from "@/authorization"

const UtilContext = createContext<UtilContextType | null>(null)

export const UtilContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [ethPrice, setEthPrice] = useState<EthPriceType>({
        open: 0,
        close: 0,
        high: 0,
        low: 0
    })
    const [headerPrice, setHeaderPrice] = useState<TradeHeaderType>({
        price24High: 0,
        price24Low: 0
    })


    const init = async () => {
        const result = await Authorization()
        const _accessToken = result.data.access_token
        localStorage.setItem("accessToken", _accessToken)
    }

    const value = useMemo(() => ({
        ethPrice: ethPrice,
        headerPrice: headerPrice,
        setHeaderPrice: setHeaderPrice,
        setEthPrice: setEthPrice,

    }), [ethPrice, setEthPrice])

    useEffect(() => {
        init();
    }, []);

    return (
        <UtilContext.Provider value={value}>
            {children}
        </UtilContext.Provider>
    )
}

export default UtilContext