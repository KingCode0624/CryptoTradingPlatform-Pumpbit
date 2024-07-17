import client from "./client";

export async function getMarketLists() {
  try {
    const response = await client.get("/public/market/list");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch market lists:", error);
    return null;
  }
}

export async function getMarketInfo(market: string) {
  try {
    const response = await client.get("/public/market", {
      params: { market },
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
    const response = await client.get(`/public/market/ticks`, {
      params: {
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
