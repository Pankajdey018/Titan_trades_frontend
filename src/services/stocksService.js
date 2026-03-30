import { apiClient } from "./apiClient";

const normalizeStocks = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.stocks)) return payload.stocks;
  if (Array.isArray(payload?.market)) return payload.market;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const fetchStocks = async () => {
  const response = await apiClient.get("/stocks");
  return normalizeStocks(response.data);
};

export const searchStocks = async (query) => {
  const response = await apiClient.get("/stocks/search", {
    params: { q: query },
  });
  return normalizeStocks(response.data);
};

export const fetchStockBySymbol = async (symbol) => {
  const response = await apiClient.get(`/stocks/${symbol}`);
  return response?.data?.stock || response.data;
};
