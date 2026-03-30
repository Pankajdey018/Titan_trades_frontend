import React from "react";
import "./holdings.css";

import HoldingsTable from "../holdings/HoldingsTable.jsx";
import { VerticalGraph } from "../../components/charts/VerticalGraph.jsx";
import { useTrading } from "../../context/TradingContext.jsx";

const Holdings = () => {
  const { holdings, loading } = useTrading();

  const labels = holdings.map((h) => h.name || h.symbol);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Current Value",
        data: holdings.map((h) => Number(h.price || 0) * Number(h.qty || 0)),
        backgroundColor: "#1976d2",
      },
    ],
  };

  if (loading) return <p>Loading holdings...</p>;

  const totalInvestment = holdings.reduce((acc, h) => acc + h.avg * h.qty, 0);
  const currentValue = holdings.reduce((acc, h) => acc + h.price * h.qty, 0);
  const pnl = currentValue - totalInvestment;
  const isProfit = pnl >= 0;

  return (
    <div className="holdings">
      <h2>Holdings ({holdings.length})</h2>

      <HoldingsTable data={holdings} />

      <div className="holdings-summary">
        <div className="summary-row">
          <div>
            <p>Total Investment</p>
            <h4>Rs {totalInvestment.toFixed(2)}</h4>
          </div>

          <div>
            <p>Current Value</p>
            <h4>Rs {currentValue.toFixed(2)}</h4>
          </div>

          <div>
            <p>P&L</p>
            <h4 className={isProfit ? "profit" : "loss"}>Rs {pnl.toFixed(2)}</h4>
          </div>
        </div>
      </div>

      <VerticalGraph data={chartData} title="Holdings Distribution" />
    </div>
  );
};

export default Holdings;
