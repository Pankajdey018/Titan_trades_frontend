import { apiClient } from "./apiClient";

export const fetchHoldings = async () => {
  const response = await apiClient.get("/holdings");
  return response?.data?.holdings || [];
};
