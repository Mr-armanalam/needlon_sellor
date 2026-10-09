"use server";

export const getOrderFromDB = async (sessionId: string) => {
  return {
    line_items: {
      data: [
        { quantity: 1, description: "Classic Oxford Cotton Shirt" }
      ]
    },
    Payment: {
      status: "paid",
      paymentAmount: 2499,
      orderId: "ord-mock-001"
    }
  };
};
