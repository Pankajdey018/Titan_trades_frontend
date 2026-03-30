import { apiClient } from "./apiClient";

export const fetchPortfolioPositions = async () => {
  const response = await apiClient.get("/positions");
  return response?.data?.positions || [];
};

export const fetchPortfolioHoldings = async () => {
  const response = await apiClient.get("/holdings");
  return response?.data?.holdings || [];
};
