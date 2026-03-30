import React, { useMemo } from "react";
import "./summary.css";

import SummaryCard from "../components/UI/SummaryCard.jsx";
import WatchList from "../components/layout/watchList/WatchList.jsx";
import { VerticalGraph } from "../components/charts/VerticalGraph.jsx";
import { useTrading } from "../context/TradingContext.jsx";

const inr = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Summary = () => {
  const { user, loading } = useTrading();

  const historyChart = useMemo(() => {
    const history = user?.portfolio?.history || [];

    return {
      labels: history.map((item) => new Date(item.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })),
      datasets: [
        {
          label: "Portfolio value",
          data: history.map((item) => item.value),
          backgroundColor: "#1976d2",
        },
      ],
    };
  }, [user?.portfolio?.history]);

  if (loading) return <p>Loading dashboard...</p>;

  const portfolio = user?.portfolio || {};

  return (
    <div className="summary">
      <div className="summary-header">
        <h2>Hi, {user?.name || "Trader"}</h2>
      </div>

      <div className="summary-cards">
        <SummaryCard
          title="Wallet"
          value={`Rs ${inr(user?.balance)}`}
          subtitle="Available cash"
        />

        <SummaryCard
          title="Portfolio"
          value={`Rs ${inr(portfolio.pnl)}`}
          subtitle="Total P&L"
          extra={`${portfolio.pnlPercent >= 0 ? "+" : ""}${Number(portfolio.pnlPercent || 0).toFixed(2)}%`}
          profit={Number(portfolio.pnl || 0) >= 0}
        />

        <SummaryCard
          title="Today"
          value={`Rs ${inr(portfolio.todayPnl)}`}
          subtitle="Day P&L"
          profit={Number(portfolio.todayPnl || 0) >= 0}
        />
      </div>

      <div className="summary-details">
        <div className="details-box">
          <h4>Equity Details</h4>
          <p>Portfolio Value: Rs {inr(portfolio.currentValue)}</p>
          <p>Invested Capital: Rs {inr(portfolio.invested)}</p>
          <p>Total Equity: Rs {inr(portfolio.equity)}</p>
        </div>

        <div className="details-box">
          <h4>Balance Details</h4>
          <p>Available Balance: Rs {inr(user?.balance)}</p>
          <p>Opening Balance: Rs {inr(user?.openingBalance)}</p>
        </div>
      </div>

      <div className="summary-watchlist">
        <h3>Portfolio Trend</h3>
        <VerticalGraph data={historyChart} title="Portfolio Trend" />
      </div>

      <div className="summary-watchlist">
        <h3>Watchlist</h3>
        <WatchList />
      </div>
    </div>
  );
};

export default Summary;
