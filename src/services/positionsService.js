import { apiClient } from "./apiClient";

export const fetchPositions = async () => {
  const response = await apiClient.get("/positions");
  return response?.data?.positions || [];
};
