/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { fetchCurrentUser } from "../services/authService";
import { fetchHoldings } from "../services/holdingsService";
import { fetchOrders, createOrder, cancelOrder } from "../services/ordersService";
import { fetchPositions } from "../services/positionsService";
import { addFunds, withdrawFunds } from "../services/fundsService";
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from "../services/watchlistService";
import { fetchStocks } from "../services/stocksService";

const TradingContext = createContext(null);

const getErrorMessage = (error, fallback = "Something went wrong") => {
  return error?.response?.data?.message || error?.message || fallback;
};

export const TradingProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message, type = "success") => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2600);
  }, []);

  const getDisplayName = useCallback((defaultName) => {
    const savedName = localStorage.getItem("loggedInUserName");
    return savedName || defaultName || "Trader";
  }, []);

  const loadTradingState = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const [userRes, holdingsRes, positionsRes, ordersRes, watchlistRes, marketRes] = await Promise.all([
        fetchCurrentUser(),
        fetchHoldings(),
        fetchPositions(),
        fetchOrders(),
        fetchWatchlist(),
        fetchStocks(),
      ]);

      const rawUser = userRes?.user || userRes || null;
      setUser(rawUser ? { ...rawUser, name: getDisplayName(rawUser.name) } : null);
      setHoldings(Array.isArray(holdingsRes) ? holdingsRes : []);
      setPositions(Array.isArray(positionsRes) ? positionsRes : []);
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setWatchlist(Array.isArray(watchlistRes) ? watchlistRes : []);
      setMarket(Array.isArray(marketRes) ? marketRes : []);
    } catch (error) {
      pushToast(getErrorMessage(error, "Failed to sync trading data"), "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getDisplayName, pushToast]);

  useEffect(() => {
    loadTradingState();
  }, [loadTradingState]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadTradingState({ silent: true });
    }, 6000);

    return () => clearInterval(timer);
  }, [loadTradingState]);

  const placeOrder = useCallback(async (payload) => {
    const response = await createOrder(payload);

    if (response?.user) {
      setUser({ ...response.user, name: getDisplayName(response.user?.name) });
    }
    if (Array.isArray(response?.holdings)) setHoldings(response.holdings);
    if (Array.isArray(response?.positions)) setPositions(response.positions);
    if (Array.isArray(response?.orders)) setOrders(response.orders);

    pushToast(`${payload.side || payload.mode || "Order"} order executed`, "success");

    return response;
  }, [getDisplayName, pushToast]);

  const handleAddFunds = useCallback(async (amount) => {
    const response = await addFunds({ amount });
    if (response?.user) setUser({ ...response.user, name: getDisplayName(response.user?.name) });
    pushToast("Funds added successfully", "success");
    return response;
  }, [getDisplayName, pushToast]);

  const handleWithdrawFunds = useCallback(async (amount) => {
    const response = await withdrawFunds({ amount });
    if (response?.user) setUser({ ...response.user, name: getDisplayName(response.user?.name) });
    pushToast("Funds withdrawn successfully", "success");
    return response;
  }, [getDisplayName, pushToast]);

  const handleAddWatchlist = useCallback(async (symbol) => {
    const response = await addToWatchlist({ symbol });
    if (Array.isArray(response?.watchlist)) setWatchlist(response.watchlist);
    pushToast(`${symbol.toUpperCase()} added to watchlist`, "success");
    return response;
  }, [pushToast]);

  const handleRemoveWatchlist = useCallback(async (id) => {
    const response = await removeFromWatchlist(id);
    if (Array.isArray(response?.watchlist)) setWatchlist(response.watchlist);
    pushToast(`${id.toUpperCase()} removed from watchlist`, "success");
    return response;
  }, [pushToast]);

  const cancelOrderById = useCallback(async (id) => {
    const updatedOrder = await cancelOrder(id);

    setOrders((prev) =>
      prev.map((order) => {
        const orderId = order._id || order.id;
        return orderId === id ? { ...order, ...updatedOrder } : order;
      })
    );

    pushToast("Order cancelled", "success");
    return updatedOrder;
  }, [pushToast]);

  const value = useMemo(() => ({
    user,
    holdings,
    positions,
    orders,
    watchlist,
    market,
    loading,
    refreshing,
    loadTradingState,
    placeOrder,
    addFunds: handleAddFunds,
    withdrawFunds: handleWithdrawFunds,
    addWatchlist: handleAddWatchlist,
    removeWatchlist: handleRemoveWatchlist,
    cancelOrder: cancelOrderById,
    pushToast,
  }), [
    user,
    holdings,
    positions,
    orders,
    watchlist,
    market,
    loading,
    refreshing,
    loadTradingState,
    placeOrder,
    handleAddFunds,
    handleWithdrawFunds,
    handleAddWatchlist,
    handleRemoveWatchlist,
    cancelOrderById,
    pushToast,
  ]);

  return (
    <TradingContext.Provider value={value}>
      {children}
      <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999, display: "grid", gap: 8 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: toast.type === "error" ? "#ef4444" : "#111827",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: 8,
              minWidth: 220,
              fontSize: 13,
              boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);

  if (!context) {
    throw new Error("useTrading must be used inside TradingProvider");
  }

  return context;
};

export default TradingContext;
