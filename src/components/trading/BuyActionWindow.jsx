import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import GeneralContext from "../../context/GeneralContext.jsx";
import { useTrading } from "../../context/TradingContext.jsx";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [isSell, setIsSell] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { closeBuyWindow } = useContext(GeneralContext);
  const { market, placeOrder, pushToast } = useTrading();

  const livePrice = useMemo(() => {
    const stock = market.find((item) => item.symbol === uid);
    return Number(stock?.price || 0);
  }, [market, uid]);

  const margin = useMemo(() => Number(stockQuantity || 0) * livePrice, [stockQuantity, livePrice]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await placeOrder({
        symbol: uid,
        qty: Number(stockQuantity),
        side: isSell ? "SELL" : "BUY",
      });

      closeBuyWindow();
    } catch (error) {
      pushToast(error?.response?.data?.message || "Unable to execute order", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>LTP</legend>
            <input type="number" name="price" id="price" value={livePrice} readOnly />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Order value Rs {margin.toFixed(2)}</span>
        <div>
          <Link
            className="btn btn-blue"
            onClick={handleSubmit}
            style={{ opacity: submitting ? 0.7 : 1, pointerEvents: submitting ? "none" : "auto" }}
          >
            {isSell ? "Sell" : "Buy"}
          </Link>
          <Link className="btn btn-grey" onClick={() => setIsSell((prev) => !prev)}>
            Switch to {isSell ? "Buy" : "Sell"}
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
