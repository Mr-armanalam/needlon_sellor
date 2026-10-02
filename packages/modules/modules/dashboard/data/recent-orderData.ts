export const orders = [
  {
    id: "ORD-9421",
    customer: "Priya Sharma",
    initials: "PS",
    product: "Handloom Chikankari Kurti",
    amount: "₹2,450",
    time: "12 mins ago",
    status: "Pending",
  },
  {
    id: "ORD-9420",
    customer: "Rahul Mehta",
    initials: "RM",
    product: "Pure Cotton Indigo Shirt",
    amount: "₹1,850",
    time: "45 mins ago",
    status: "Pending",
  },
  {
    id: "ORD-9419",
    customer: "Ananya Iyer",
    initials: "AI",
    product: "Silver Jhumka Earrings",
    amount: "₹850",
    time: "2 hours ago",
    status: "Pending",
  },
];

export type ordersType = (typeof orders)[number];
