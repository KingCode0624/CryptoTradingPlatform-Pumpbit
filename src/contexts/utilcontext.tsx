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
import HeaderFooterSelector from "@/components/headerSelector"

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

    const [sliprate, setSlipRate] = useState<number>(1)
    const [language, setLanguage] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('language') || 'EN';
        }
        return 'EN';
    });
    const [marketOrderType, setMarketOrderType] = useState<string>("Long")

    const init = async () => {
        const result = await Authorization()
        const _accessToken = result.data.access_token
        localStorage.setItem("accessToken", _accessToken)
    }

    const value = useMemo(() => ({
        ethPrice: ethPrice,
        headerPrice: headerPrice,
        sliprate: sliprate,
        language: language,
        marketOrderType: marketOrderType,
        setMarketOrderType: setMarketOrderType,
        setSlipRate: setSlipRate,
        setHeaderPrice: setHeaderPrice,
        setEthPrice: setEthPrice,
        setLanguage: setLanguage

    }), [ethPrice, headerPrice, sliprate, language, setSlipRate, setHeaderPrice, setEthPrice, setLanguage])

    useEffect(() => {
        init();
        setLanguage(() => {
            if (typeof window !== 'undefined') {
                return localStorage.getItem('language') || 'EN';
            }
            return 'EN';
        })
    }, []);


    return (
        <UtilContext.Provider value={value}>
            {children}
        </UtilContext.Provider>
    )
}

export default UtilContext