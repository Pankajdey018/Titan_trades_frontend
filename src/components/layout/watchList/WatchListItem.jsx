import React, { useState } from "react";
import WatchListActions from "./WatchListActions";

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

const WatchListItem = ({ stock, onRemove }) => {
  const [hover, setHover] = useState(false);

  const stockName = stock.name || stock.symbol;
  const isDown = typeof stock.isDown === "boolean"
    ? stock.isDown
    : String(stock.percent || "").includes("-");

  return (
    <li
      className="watchlist-item"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="item-left">
        <p className={isDown ? "down" : "up"}>
          {stockName}
        </p>
      </div>

      <div className="item-right">
        <span>{stock.percent || "--"}</span>

        {isDown ? (
          <KeyboardArrowDown className="down" />
        ) : (
          <KeyboardArrowUp className="up" />
        )}

        <span>Rs {stock.price || stock.ltp || 0}</span>
      </div>

      {hover && <WatchListActions stock={stock} onRemove={onRemove} />}
    </li>
  );
};

export default WatchListItem;
