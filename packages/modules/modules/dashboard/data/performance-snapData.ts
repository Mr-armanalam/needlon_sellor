
// Zero-state fallback shown only before live dashboard data loads.
// Values are honest placeholders (₹0 / "—"), never invented metrics.
export const metrics = [
  {
    title: "Revenue",
    value: "₹0",
    change: "—",
    isPositive: true,
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    title: "Products Sold",
    value: "0 items",
    change: "—",
    isPositive: true,
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    title: "Average Order Value",
    value: "₹0",
    change: "—",
    isPositive: true,
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    title: "Returning Customers",
    value: "0%",
    change: "—",
    isPositive: true,
    sparkline: [],
  },
];

export type metricsType = typeof metrics[number];
