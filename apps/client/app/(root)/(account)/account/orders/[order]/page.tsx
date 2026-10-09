import { getOrder } from "@/modules/account/server/api/order";
import IndividualOrder from "@/modules/orders/section/individual-order";
import { cookies } from "next/headers";


const page = async ({ params }: { params: Promise<{ order: string }> }) => {
  const { order: orderId } = await params;

  const cookie = await cookies();
  const cookieStore = cookie.toString();
  const orderItem = await getOrder(orderId, cookieStore);

  return (
    <div className=" overflow-y-scroll no-scrollbar">
      <IndividualOrder orderItem={orderItem} />
    </div>
  );
};

export default page;

