
export  const products = [
    {
      id: 1,
      name: "Handloom Chikankari Kurti",
      stock: 14,
      views: 520,
      likes: 84,
      sales: 32,
      price: "₹2,450",
      imageColor: "bg-orange-100 text-orange-700", // Placeholder asset styles
      initials: "CK",
    },
    {
      id: 2,
      name: "Pure Cotton Indigo Shirt",
      stock: 2,
      views: 340,
      likes: 41,
      sales: 18,
      price: "₹1,850",
      imageColor: "bg-blue-100 text-blue-700",
      initials: "IS",
    },
    {
      id: 3,
      name: "Silver Jhumka Earrings",
      stock: 45,
      views: 1210,
      likes: 312,
      sales: 88,
      price: "₹850",
      imageColor: "bg-amber-100 text-amber-700",
      initials: "JE",
    },
  ];

  export type productType = typeof products[number];