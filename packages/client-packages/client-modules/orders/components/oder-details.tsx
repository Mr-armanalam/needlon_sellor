import { Address } from "@/types/address";
import { format } from "date-fns";

interface props {
  order_date: Date;
  order_id: string;
  shipping_address: Address;
  payment_method: string;
  shippingCharge: number;
  pod_charge: number;
  itemPrice: number;
  couponDiscount: number;
  totalPurchasePrice: number;
  noOfItem: number;
}
const OrderDetails = ({
  order_date,
  order_id,
  shipping_address: sd,
  payment_method,
  shippingCharge,
  pod_charge,
  itemPrice,
  totalPurchasePrice,
  couponDiscount,
  noOfItem,
}: props) => {
  return (
    <div className="md:px-1 mb-4 dark:text-white/70 text-gray-900">
      <div className="flex items-center text-sm gap-x-4">
        <p>Order placed {format(order_date, "dd MMMM yyyy")}</p>
        <div className="h-3.75 w-0.5 bg-gray-300 border-l" />
        <p>Order number {order_id}</p>
      </div>
      <div className="flex max-md:flex-col border bg-gray-900 dark:bg-stone-900 text-white rounded-md p-4 text-sm mt-2 gap-x-8 justify-between">
        <div className="flex-1/3 p-4">
          <h2 className="font-semibold mb-4">Ship to</h2>
          <p className="text-wrap text-xs leading-5">
            {sd.name}, {sd.pincode}, {sd.address}, {sd.phone}, {sd.landmark},{" "}
            {sd.locality}
          </p>
        </div>
        <div className="flex-1/3 p-4">
          <h3 className="font-semibold">Payment method</h3>
          <p className="text-sm capitalize mt-6 text-green-500 ">
            {payment_method ?? "Pay on Delivery"}
          </p>
        </div>
        <div className="flex-1/3 bg-stone-200/50 text-gray-950 p-4 rounded-xl ">
          <h4 className="font-semibold border-b py-1 border-gray-900">Order Summary</h4>
          <div className="text-xs flex flex-col gap-y">
            <div className="flex border-b py-1 border-gray-900 justify-between items-center">
              <p>Item({noOfItem}) Subtotal:</p>
              <p>{noOfItem * itemPrice}</p>
            </div>
            <div className="flex border-b py-1 border-gray-900  justify-between items-center">
              <p>Shipping({noOfItem}):</p>
              <p>{noOfItem * shippingCharge}</p>
            </div>
            {couponDiscount !==0 && (
              <div className="flex border-b py-1 border-gray-900  justify-between items-center">
                <p>Coupon Discount:</p>
                <p className="text-green-500">-{couponDiscount}</p>
              </div>
            )}
            {pod_charge !==0 && (
              <div className="flex border-b py-1 border-gray-900  justify-between items-center">
                <p>Cash/Pay on Delivery fee:</p>
                <p>{pod_charge}</p>
              </div>
            )}
            <div className="flex justify-between py-1 items-center">
              <p className="font-semibold">Total:</p>
              <p>{totalPurchasePrice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
