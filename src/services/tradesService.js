import { apiClient } from "./apiClient";

export const fetchTrades = async (params = {}) => {
  const response = await apiClient.get("/trades", { params });
  return response.data;
};
