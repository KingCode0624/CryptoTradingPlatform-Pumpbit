import client, { tickets } from "./client";
import axios from "axios";
export async function getPublicMarket(market: string, chain: string) {
  try {
    const response = await client.get("/public/market", {
      params: {
        market,
        chain
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch market lists:", error);
    return null;
  }
}

export async function getMarketLists() {
  try {
    const response = await client.get("/public/market/list");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch market lists:", error);
    return null;
  }
}

export async function getMarketInfo(market: string, chain: string) {
  try {
    const response = await client.get("/public/market", {
      params: { market, chain },
    });
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error("Failed to fetch market info:", error);
    return error;
  }
}

export async function getMarketTicks(market: string, chain: string, interval: string, countBack: Number, from: number, to: number) {
  try {
    const response = await tickets.get(`/public/market/ticks`, {
      params: {
        to: to,
        from: from,
        market: market,
        interval: interval,
        chain: chain,
        count_back: countBack
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch market ticks:", error);
    return null;
  }
}

export async function getPosition(accessToken: string, market: string, chain: string) {
  try {
    const positions = await client.get(`/positions/`, {
      // headers: {
      //   'Authorization': `${accessToken}` // Use the provided accessToken
      // },
      headers: {
        "X-CMC_PRO_API_KEY": process.env.REACT_APP_MARKET_CAP_KEY,
        "Authorization": accessToken
      },
      params: {
        chain: chain,
        market: market
      }
    })
    return positions.data

  } catch (err) {
    console.log("Error => ", err)
  }
}

export async function getOrders(accessToken: string, market: string, chain: string) {

  try {
    const orders = await client.get(`/orders/`, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.REACT_APP_MARKET_CAP_KEY,
        "Authorization": accessToken
      },
      params: {
        chain: chain,
        market: market
      }
    })
    return orders.data

  } catch (err) {
    console.log("Error => ", err)
  }
}


export async function getHistories(accessToken: string, market: string, chain: string) {

  try {
    const histories = await client.get(`/position/histories`, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.REACT_APP_MARKET_CAP_KEY,
        "Authorization": accessToken
      },
      params: {
        chain: chain,
        market: market
      }
    })

    return histories.data

  } catch (err) {
    console.log("Error => ", err)
  }
}

export async function getPool(accessToken: string, market: string, chain: string) {
  try {
    const pool = await client.get("/public/pools", {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.REACT_APP_MARKET_CAP_KEY,
        "Authorization": accessToken
      },
      params: {
        chain: chain,
        market: market
      }
    }
    )
    return pool.data
  } catch (err) {
    console.log("Error =>", err)
  }
}

export async function getLiquidityPosition(accessToken: string, market: string, chain: string) {
  try {
    const liquidityPosition = await client.get(`/liquidity-positions`,
      {
        headers: {
          'Authorization': accessToken
        },
        params: {
          chain: "b_square_testnet",
          market: "btcusdt"
        }
      })
    return liquidityPosition.data
  } catch (err) {
    console.log("Error =>", err)
  }
}
