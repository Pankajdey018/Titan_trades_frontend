import React, { useMemo, useState } from "react";
import "./WatchList.css";

import WatchListItem from "./WatchListItem";
import { DoughnutChart } from "../../charts/DoughnoutChart";
import { useTrading } from "../../../context/TradingContext.jsx";

const WatchList = () => {
  const [search, setSearch] = useState("");
  const [symbolInput, setSymbolInput] = useState("");
  const { watchlist, addWatchlist, removeWatchlist, loading, pushToast } = useTrading();

  const filteredData = useMemo(
    () =>
      watchlist.filter((stock) =>
        (stock.name || stock.symbol || "").toLowerCase().includes(search.toLowerCase())
      ),
    [watchlist, search]
  );

  const chartData = {
    labels: filteredData.map((s) => s.name || s.symbol),
    datasets: [
      {
        label: "Price",
        data: filteredData.map((s) => Number(s.price || s.ltp || 0)),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
        borderWidth: 1,
      },
    ],
  };

  const handleAdd = async () => {
    const symbol = symbolInput.trim().toUpperCase();
    if (!symbol) return;

    try {
      await addWatchlist(symbol);
      setSymbolInput("");
    } catch (error) {
      pushToast(error?.response?.data?.message || "Unable to add stock", "error");
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await removeWatchlist(symbol);
    } catch (error) {
      pushToast(error?.response?.data?.message || "Unable to remove stock", "error");
    }
  };

  return (
    <div className="watchlist">
      <div className="watchlist-header">
        <input
          type="text"
          placeholder="Search stocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span>{filteredData.length}/{watchlist.length || 0}</span>
      </div>

      <div className="watchlist-header" style={{ marginTop: 8 }}>
        <input
          type="text"
          placeholder="Add symbol (e.g. AMD)"
          value={symbolInput}
          onChange={(e) => setSymbolInput(e.target.value)}
        />
        <button type="button" className="watchlist-add-button" onClick={handleAdd}>
          Add Symbol
        </button>
      </div>

      {loading && <p className="watchlist-note">Syncing watchlist...</p>}

      <ul className="watchlist-list">
        {filteredData.map((stock) => (
          <WatchListItem
            key={stock.symbol || stock.name}
            stock={stock}
            onRemove={handleRemove}
          />
        ))}
      </ul>

      <div className="watchlist-chart">
        <DoughnutChart data={chartData} />
      </div>
    </div>
  );
};

export default WatchList;
