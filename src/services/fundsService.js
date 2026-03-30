import { apiClient } from "./apiClient";

export const fetchFunds = async () => {
  const response = await apiClient.get("/user");
  return response.data;
};

export const addFunds = async (payload) => {
  const response = await apiClient.post("/funds/add", payload);
  return response.data;
};

export const withdrawFunds = async (payload) => {
  const response = await apiClient.post("/funds/withdraw", payload);
  return response.data;
};
