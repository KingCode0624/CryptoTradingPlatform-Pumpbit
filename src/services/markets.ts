import client from "./client";

export async function getPublicMarket(market: string, chain: string) {
  try {
    const response = await client.get("/public/market", {
      params: { market, chain },
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

export async function getMarketTicks(market: string, chain: string, interval: string, countBack: Number) {
  try {
    const currentDate = new Date();
    const currentTimeStap = currentDate.getTime()
    const thirtyAgoTimeStap = currentDate.getTime() - (5 * 24 * 60 * 60 * 1000)

    const response = await client.get(`/public/market/ticks`, {
      params: {
        to: currentTimeStap,
        from: thirtyAgoTimeStap,
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
      headers: {
        'Authorization': `${accessToken}` // Use the provided accessToken
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
        'Authorization': `${accessToken}` // Use the provided accessToken
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
        'Authorization': `${accessToken}` // Use the provided accessToken
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
