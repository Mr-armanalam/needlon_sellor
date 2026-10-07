import React from "react";
import OrderDetails from "../components/oder-details";
import OrderStatus from "../components/order-status";
import { OrderItemProp } from "@/types/product";

const IndividualOrder = ({
  orderItem,
}: {
  orderItem: OrderItemProp[] | null;
}) => {
  const firstOrder = orderItem?.[0];

  return (
    <div className="md:px-6 max-md:max-w-[100vw] px-3 overflow-y-scroll no-scrollbar">
      <h1 className="text-3xl mb-2 font-garamond font-semibold dark:text-white text-gray-900">
        Order Details
      </h1>
      {firstOrder && (
        <>
          <OrderDetails
            noOfItem={orderItem.length}
            order_date={firstOrder.orderDate ?? new Date()}
            order_id={firstOrder.orderId}
            shipping_address={firstOrder.shippingAddress}
            shippingCharge={firstOrder.shippingCharge}
            pod_charge={firstOrder.podCharge}
            payment_method={firstOrder.paymentMode}
            itemPrice={firstOrder.priceAtperchage}
            totalPurchasePrice={firstOrder.totalPurchasePrice}
            couponDiscount={firstOrder.couponDiscount}
          />

           {orderItem?.map((order, index) => (
            <OrderStatus
              key={index}
              productId={order.productId}
              itemName={order?.itemName}
              itemPrice={order?.priceAtperchage}
              image={order?.image}
              properties={order?.orderProperties}
              orderItemId={order.orderId}
            />
          ))} 
        </>
      )}
    </div>
  );
};

export default IndividualOrder;
