import React, { useContext, useState } from "react";
import GeneralContext from "../../../context/GeneralContext";

import { Tooltip } from "@mui/material";
import { BarChartOutlined, DeleteOutline } from "@mui/icons-material";
import { useTrading } from "../../../context/TradingContext.jsx";

const WatchListActions = ({ stock, onRemove }) => {
  const { openBuyWindow } = useContext(GeneralContext);
  const { placeOrder, pushToast } = useTrading();
  const [submitting, setSubmitting] = useState(false);

  const symbol = stock.symbol || stock.name;

  const handleSell = async () => {
    try {
      setSubmitting(true);
      await placeOrder({
        symbol,
        qty: 1,
        side: "SELL",
      });
    } catch (error) {
      pushToast(error?.response?.data?.message || "Unable to place sell order", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="watchlist-actions">
      <Tooltip title="Buy">
        <button className="buy" onClick={() => openBuyWindow(symbol)}>
          Buy
        </button>
      </Tooltip>

      <Tooltip title="Sell">
        <button className="sell" onClick={handleSell} disabled={submitting}>
          Sell
        </button>
      </Tooltip>

      <Tooltip title="Analytics">
        <button>
          <BarChartOutlined />
        </button>
      </Tooltip>

      <Tooltip title="Remove">
        <button onClick={() => onRemove?.(symbol)}>
          <DeleteOutline />
        </button>
      </Tooltip>
    </div>
  );
};

export default WatchListActions;
