
export  const metrics = [
    {
      title: "Revenue",
      value: "₹24,850",
      change: "+14.2%",
      isPositive: true,
      // Mini sparkline data representing recent trend path points
      sparkline: [20, 35, 30, 45, 40, 55, 60],
    },
    {
      title: "Products Sold",
      value: "42 items",
      change: "+8.1%",
      isPositive: true,
      sparkline: [15, 22, 18, 25, 30, 28, 42],
    },
    {
      title: "Conversion Rate",
      value: "3.4%",
      change: "-0.5%",
      isPositive: false,
      sparkline: [4.0, 3.8, 3.9, 3.5, 3.6, 3.2, 3.4],
    },
    {
      title: "Returning Customers",
      value: "68%",
      change: "+2.3%",
      isPositive: true,
      sparkline: [60, 62, 61, 63, 65, 66, 68],
    },
  ];

  export type metricsType = typeof metrics[number];