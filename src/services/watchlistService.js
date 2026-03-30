import { apiClient } from "./apiClient";

const normalizeWatchlistPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.watchlist)) return payload.watchlist;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const fetchWatchlist = async () => {
  const response = await apiClient.get("/watchlist");
  return normalizeWatchlistPayload(response.data);
};

export const addToWatchlist = async (payload) => {
  const response = await apiClient.post("/watchlist", payload);
  return response.data;
};

export const removeFromWatchlist = async (symbol) => {
  const response = await apiClient.delete(`/watchlist/${symbol}`);
  return response.data;
};
