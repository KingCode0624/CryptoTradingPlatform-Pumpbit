"use client"
import {
    createContext,
    useEffect,
    useState,
    useMemo,
} from "react"
import { UtilContextType, MarketPriceType, TradeHeaderType } from "@/types"
import { Authorization } from "@/authorization"
import { useWeb3 } from "@/hooks"

const UtilContext = createContext<UtilContextType | null>(null)



export const UtilContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { account, positionRouterContract, web3, chainId, isConnected } = useWeb3()
    const [intervalApiTimer, setIntervalApiTimer] = useState<number>(60000)
    const [isIdle, setIsIdle] = useState<boolean>(false)
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

    const setExpiryTime = () => {
        const idleTime = 0.2 // Set expiry time to 5 minutes from now 
        const expiryTime = Date.now() + idleTime * 60 * 1000;
        localStorage.setItem("idleTime", String(expiryTime));
        setIntervalApiTimer(1000)
    };

    const init = async () => {
        try {
            let result: any = "Account is undefined"
        } catch (err) {

        }
    }

    const getIdleTime = () => {
        const expiryTime = localStorage.getItem("idleTime")
        if (Number(expiryTime) < Date.now()) {
            setExpiryTime()
            setIntervalApiTimer(24 * 3600 * 1000)

            if (isConnected === true) {
                setIsIdle(true)
            }
        }
    }

    const value = useMemo(() => ({
        marketPrice: marketPrice,
        headerPrice: headerPrice,
        sliprate: sliprate,
        language: language,
        marketOrderType: marketOrderType,
        marketPair: marketPair,
        intervalApiTimer: intervalApiTimer,
        isIdle: isIdle,
        setMarketOrderType: setMarketOrderType,
        setSlipRate: setSlipRate,
        setHeaderPrice: setHeaderPrice,
        setMarketPrice: setMarketPrice,
        setLanguage: setLanguage,
        setMarketPair: setMarketPair,
        setIntervalApiTimer: setIntervalApiTimer,
        setIsIdle: setIsIdle

    }), [
        marketPrice,
        headerPrice,
        sliprate,
        language,
        marketPair,
        intervalApiTimer,
        isIdle,
        setIsIdle,
        setMarketPair,
        setSlipRate,
        setHeaderPrice,
        setMarketPrice,
        setLanguage,
        setIntervalApiTimer
    ])

    useEffect(() => {
        setLanguage(() => {
            if (typeof window !== 'undefined') {
                return localStorage.getItem('language') || 'EN';
            }
            return 'EN';
        })
        const idleInterval = setInterval(() => {
            getIdleTime()
        }, 1000)
        setExpiryTime();
        // Set event listeners for user activity
        window.addEventListener('click', setExpiryTime);
        window.addEventListener('keypress', setExpiryTime);
        window.addEventListener('scroll', setExpiryTime);
        window.addEventListener('mousemove', setExpiryTime);

        // Clean up event listeners on component unmount
        return () => {
            window.removeEventListener('click', setExpiryTime);
            window.removeEventListener('keypress', setExpiryTime);
            window.removeEventListener('scroll', setExpiryTime);
            window.removeEventListener('mousemove', setExpiryTime);
            clearInterval(idleInterval)
        };

    }, []);

    useEffect(() => {
        init();
    }, [account])

    useEffect(() => {
        localStorage.setItem("accessToken", "false")
        if (isConnected == true) {
            setIntervalApiTimer(1000)
        }
    }, [isConnected])

    useEffect(() => {
        console.log("IntervalTimer =>", intervalApiTimer)
    }, [intervalApiTimer])

    return (
        <UtilContext.Provider value={value}>
            {children}
        </UtilContext.Provider>
    )
}

export default UtilContext