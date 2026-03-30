import React, { useMemo, useState } from "react";
import "./positions.css";

import PositionsTable from "../position/PositionsTable.jsx";
import { useTrading } from "../../context/TradingContext.jsx";

const Positions = () => {
  const { positions, loading } = useTrading();
  const [filter, setFilter] = useState("ALL");

  const filteredPositions = useMemo(() => {
    return filter === "ALL"
      ? positions
      : positions.filter((p) => p.product === filter);
  }, [filter, positions]);

  if (loading) return <p>Loading positions...</p>;

  const totalPnl = filteredPositions.reduce((acc, p) => acc + (p.price - p.avg) * p.qty, 0);
  const isProfit = totalPnl >= 0;

  return (
    <div className="positions">
      <div className="positions-header">
        <h2>Positions</h2>
        <span>{filteredPositions.length} items</span>
      </div>

      <div className="filters">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>

        <button
          className={filter === "CNC" ? "active" : ""}
          onClick={() => setFilter("CNC")}
        >
          CNC
        </button>

        <button
          className={filter === "MIS" ? "active" : ""}
          onClick={() => setFilter("MIS")}
        >
          MIS
        </button>
      </div>

      <PositionsTable data={filteredPositions} />

      <div className="positions-summary">
        <p>Total P&L</p>
        <h3 className={isProfit ? "profit" : "loss"}>Rs {totalPnl.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default Positions;
