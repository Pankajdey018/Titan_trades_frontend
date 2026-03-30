import React from "react";

const PositionRow = ({ stock }) => {
  const pnl = (stock.price - stock.avg) * stock.qty;
  const isProfit = pnl >= 0;

  return (
    <tr>
      <td>{stock.product}</td>
      <td>{stock.name || stock.symbol}</td>
      <td>{stock.qty}</td>
      <td>Rs {stock.avg.toFixed(2)}</td>
      <td>Rs {stock.price.toFixed(2)}</td>

      <td className={isProfit ? "profit" : "loss"}>
        Rs {pnl.toFixed(2)}
      </td>

      <td className={stock.isLoss ? "loss" : "profit"}>
        {stock.day}
      </td>
    </tr>
  );
};

export default PositionRow;
