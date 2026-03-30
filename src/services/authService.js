import { apiClient, setAuthToken } from "./apiClient";

export const registerUser = async (payload) => {
  const response = await apiClient.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await apiClient.post("/auth/login", payload);
  const token = response?.data?.token || response?.data?.accessToken;
  const nameFromApi = response?.data?.user?.name;
  const fallbackName = String(payload?.email || "Trader").split("@")[0] || "Trader";
  const username = nameFromApi || fallbackName;

  if (token) setAuthToken(token);
  localStorage.setItem("loggedInUserName", username);

  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response?.data?.user ? response.data : { user: response.data };
};
