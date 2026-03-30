import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./layout.css";

import { searchStocks } from "../../services/stocksService";
import { useTrading } from "../../context/TradingContext.jsx";

const TopBar = () => {
  const [time, setTime] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { market, watchlist, addWatchlist, pushToast } = useTrading();

  const benchmark = useMemo(() => market.slice(0, 2), [market]);
  const localMatches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery.length < 2) return [];

    return market
      .filter((item) => {
        const symbol = (item.symbol || "").toLowerCase();
        const name = (item.name || item.companyName || "").toLowerCase();

        return symbol.includes(normalizedQuery) || name.includes(normalizedQuery);
      })
      .slice(0, 6);
  }, [market, query]);

  const displayedResults = results.length > 0 ? results : localMatches;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formattedTime = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setTime(formattedTime);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);

      try {
        const list = await searchStocks(query.trim());
        setResults(list.slice(0, 6));
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectStock = async (item) => {
    const symbol = (item.symbol || item.ticker || query).toUpperCase();

    if (!symbol) return;

    const alreadyAdded = watchlist.some(
      (stock) => (stock.symbol || stock.name || "").toUpperCase() === symbol
    );

    try {
      if (alreadyAdded) {
        pushToast(`${symbol} is already in your watchlist`, "success");
      } else {
        await addWatchlist(symbol);
      }

      setQuery("");
      setResults([]);
      navigate("/dashboard");
    } catch (error) {
      pushToast(error?.response?.data?.message || "Unable to add stock", "error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (displayedResults.length > 0) {
      await handleSelectStock(displayedResults[0]);
      return;
    }

    const symbol = query.trim().toUpperCase();
    if (!symbol) return;

    await handleSelectStock({ symbol, name: symbol });
  };

  return (
    <div className="topbar">
      <div className="market">
        {benchmark.map((item) => (
          <div key={item.symbol} className="market-item">
            <span className="market-name">{item.symbol}</span>
            <span className={`market-value ${item.isDown ? "negative" : "positive"}`}>
              {item.percent}
            </span>
          </div>
        ))}
      </div>

      <form className="search-box" onSubmit={handleSubmit}>
        <input
          placeholder="Search stocks, ETFs..."
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (value.trim().length < 2) setResults([]);
          }}
        />

        {query.trim().length >= 2 && (
          <div className="search-results">
            {isSearching && <p className="search-results-state">Searching market...</p>}

            {!isSearching && displayedResults.length === 0 && (
              <p className="search-results-state">No matching symbols found.</p>
            )}

            {!isSearching &&
              displayedResults.map((item, idx) => {
                const symbol = item.symbol || item.ticker || item.name || `STOCK-${idx}`;
                const name = item.name || item.companyName || symbol;

                return (
                  <button
                    type="button"
                    key={`${symbol}-${idx}`}
                    className="search-result-item"
                    onClick={() => handleSelectStock({ ...item, symbol, name })}
                  >
                    <div className="search-result-copy">
                      <strong>{symbol}</strong>
                      <span>{name}</span>
                    </div>
                    <span className="search-result-action">Add</span>
                  </button>
                );
              })}
          </div>
        )}
      </form>

      <div className="topbar-right">
        <span className="time">{time}</span>

        <div className="icon">BELL</div>
        <div className="icon">SET</div>
      </div>
    </div>
  );
};

export default TopBar;
