import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://api.inftytrade.xyz/v1/",
});

export default client;
