import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useTrading } from "../context/TradingContext.jsx";
import "./Orders.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "Pending";

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? "Pending" : parsedDate.toLocaleString();
};

const normalizeLabel = (value, fallback) => String(value || fallback).toUpperCase();
const getOrderId = (order) => order?._id || order?.id;

const normalizeOrderShape = (order) => {
  if (!order) return null;

  return {
    ...order,
    id: getOrderId(order),
    symbol: order.symbol || order.name || "Unknown",
    side: normalizeLabel(order.side || order.orderType || order.mode, "BUY"),
    status: normalizeLabel(order.status, "EXECUTED"),
    qty: Number(order.qty || 0),
    price: Number(order.price || order.marketPrice || order.limitPrice || 0),
    amount: Number(order.amount || Number(order.qty || 0) * Number(order.price || 0)),
    orderMode: normalizeLabel(order.orderMode || order.mode, "MARKET"),
    createdAt: order.createdAt || order.executedAt,
  };
};

const Orders = () => {
  const { orders, loading, cancelOrder, pushToast } = useTrading();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sideFilter, setSideFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const normalizedOrders = useMemo(() => orders.map(normalizeOrderShape).filter(Boolean), [orders]);

  const executedOrders = normalizedOrders.filter((order) =>
    ["executed", "completed", "filled"].includes(String(order.status || "executed").toLowerCase())
  ).length;

  const buyOrders = normalizedOrders.filter(
    (order) => String(order.side || order.mode || "").toLowerCase() === "buy"
  ).length;

  const totalValue = normalizedOrders.reduce((sum, order) => {
    const amount = order.amount ?? Number(order.qty || 0) * Number(order.price || 0);
    return sum + Number(amount || 0);
  }, 0);

  const filteredOrders = useMemo(() => {
    return normalizedOrders.filter((order) => {
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const matchesSide = sideFilter === "ALL" || order.side === sideFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        order.symbol.toLowerCase().includes(query) ||
        order.orderMode.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query);

      return matchesStatus && matchesSide && matchesSearch;
    });
  }, [normalizedOrders, search, sideFilter, statusFilter]);

  const handleCancelOrder = async (event, order) => {
    event.stopPropagation();

    if (!order.id || order.status === "EXECUTED" || order.status === "CANCELLED") return;

    try {
      setCancellingId(order.id);
      await cancelOrder(order.id);
    } catch (error) {
      pushToast(error?.response?.data?.message || "Unable to cancel order", "error");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <section className="orders-hero">
        <div>
          <p className="orders-eyebrow">Order Book</p>
          <h1>Track every trade with more clarity</h1>
          <p className="orders-subtitle">
            Review recent activity, monitor execution status, and keep a quick pulse on total
            order value.
          </p>
        </div>

        <div className="orders-stat-grid">
          <div className="orders-stat-card">
            <span>Total Orders</span>
            <strong>{normalizedOrders.length}</strong>
            <small>All placed instructions</small>
          </div>
          <div className="orders-stat-card">
            <span>Executed</span>
            <strong>{executedOrders}</strong>
            <small>Successfully processed</small>
          </div>
          <div className="orders-stat-card">
            <span>Buy Orders</span>
            <strong>{buyOrders}</strong>
            <small>Accumulation activity</small>
          </div>
          <div className="orders-stat-card orders-stat-card--value">
            <span>Order Value</span>
            <strong>{formatCurrency(totalValue)}</strong>
            <small>Combined notional amount</small>
          </div>
        </div>
      </section>

      {normalizedOrders.length === 0 ? (
        <section className="orders-empty">
          <div className="orders-empty-orb" />
          <p className="orders-empty-title">You have not placed any orders yet</p>
          <p className="orders-empty-copy">
            Start with a trade from the dashboard and your order history will appear here with
            status, pricing, and timestamps.
          </p>

          <Link to="/dashboard" className="btn">
            Start trading
          </Link>
        </section>
      ) : (
        <section className="orders-panel">
          <div className="orders-panel-header">
            <div>
              <p className="orders-panel-kicker">Live activity</p>
              <h2>Orders ({filteredOrders.length})</h2>
            </div>
            <p className="orders-panel-note">
              Filter the book, inspect an order, and cancel any pending instruction.
            </p>
          </div>

          <div className="orders-toolbar">
            <input
              className="orders-search"
              type="text"
              placeholder="Search symbol, type, or status"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <div className="orders-filter-group">
              <button type="button" className={statusFilter === "ALL" ? "is-active" : ""} onClick={() => setStatusFilter("ALL")}>
                All statuses
              </button>
              <button type="button" className={statusFilter === "EXECUTED" ? "is-active" : ""} onClick={() => setStatusFilter("EXECUTED")}>
                Executed
              </button>
              <button type="button" className={statusFilter === "CANCELLED" ? "is-active" : ""} onClick={() => setStatusFilter("CANCELLED")}>
                Cancelled
              </button>
            </div>

            <div className="orders-filter-group">
              <button type="button" className={sideFilter === "ALL" ? "is-active" : ""} onClick={() => setSideFilter("ALL")}>
                All sides
              </button>
              <button type="button" className={sideFilter === "BUY" ? "is-active" : ""} onClick={() => setSideFilter("BUY")}>
                Buy
              </button>
              <button type="button" className={sideFilter === "SELL" ? "is-active" : ""} onClick={() => setSideFilter("SELL")}>
                Sell
              </button>
            </div>
          </div>

          <div className="orders-table-shell">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Side</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id || `${order.symbol}-${order.createdAt || order.qty}`}>
                    <td>
                      <div className="orders-symbol-cell">
                        <span className="orders-symbol-mark">{order.symbol.slice(0, 2)}</span>
                        <div>
                          <strong>{order.symbol}</strong>
                          <small>{order.orderMode} order</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`orders-badge ${
                          order.side.toLowerCase() === "sell"
                            ? "orders-badge--sell"
                            : "orders-badge--buy"
                        }`}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td>{order.qty}</td>
                    <td>{formatCurrency(order.price)}</td>
                    <td>{formatCurrency(order.amount)}</td>
                    <td>
                      <span className="orders-status-pill">{order.status}</span>
                    </td>
                    <td className="orders-time-cell">{formatDate(order.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="orders-table-action"
                        disabled={
                          cancellingId === order.id ||
                          order.status === "EXECUTED" ||
                          order.status === "CANCELLED"
                        }
                        onClick={(event) => handleCancelOrder(event, order)}
                      >
                        {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default Orders;
