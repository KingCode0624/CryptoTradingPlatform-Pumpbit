"use client"
import {
    useContext,
    createContext,
    useEffect,
    useCallback,
    useState,
    useMemo,
} from "react"
import { UtilContextType, MarketPriceType, TradeHeaderType } from "@/types"
import { Authorization } from "@/authorization"
import HeaderFooterSelector from "@/components/headerSelector"

const UtilContext = createContext<UtilContextType | null>(null)

export const UtilContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [marketPrice, setMarketPrice] = useState<MarketPriceType>({
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
    const [marketPair, setMarketPair] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const _lgPair = localStorage.getItem('pair')
            if (_lgPair === "BTC/USDC")
                return "btcusdt"
            if (_lgPair === "ETH/USDC")
                return "ethusdt"
        }
        return "btcusdt"
    })


    const init = async () => {
        try {
            const result = await Authorization()
            const _accessToken = result.data.access_token
            localStorage.setItem("accessToken", _accessToken)
        } catch (err) {

        }
    }

    const value = useMemo(() => ({
        marketPrice: marketPrice,
        headerPrice: headerPrice,
        sliprate: sliprate,
        language: language,
        marketOrderType: marketOrderType,
        marketPair: marketPair,
        setMarketOrderType: setMarketOrderType,
        setSlipRate: setSlipRate,
        setHeaderPrice: setHeaderPrice,
        setMarketPrice: setMarketPrice,
        setLanguage: setLanguage,
        setMarketPair: setMarketPair,

    }), [
        marketPrice,
        headerPrice,
        sliprate,
        language,
        marketPair,
        setMarketPair,
        setSlipRate,
        setHeaderPrice,
        setMarketPrice,
        setLanguage
    ])

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