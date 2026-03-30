import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { baseOptions } from "../theme/chartConfig";
import { chartTheme } from "../theme/theme.js";

ChartJS.register(ArcElement, Tooltip);

export function DoughnutChart({ data }) {
  const options = {
    ...baseOptions,
    cutout: "75%", // 🔥 thin ring
    plugins: {
      ...baseOptions.plugins,
    },
  };

  const styledData = {
    ...data,
    datasets: data.datasets.map((ds) => ({
      ...ds,
      backgroundColor: chartTheme.colors,
      borderWidth: 0,
      hoverOffset: 6,
    })),
  };

  return (
    <div style={{ height: "260px" }}>
      <Doughnut data={styledData} options={options} />
    </div>
  );
}