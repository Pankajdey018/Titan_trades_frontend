// chartConfig.js
import { chartTheme } from "./theme";

export const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      display: false, // 🔥 modern dashboards hide legend
    },
    tooltip: {
      backgroundColor: chartTheme.tooltipBg,
      titleColor: "#fff",
      bodyColor: chartTheme.tooltipText,
      borderColor: "#374151",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (ctx) => `₹ ${ctx.raw.toLocaleString()}`,
      },
    },
  },
  animation: {
    duration: 600,
    easing: "easeOutCubic",
  },
};