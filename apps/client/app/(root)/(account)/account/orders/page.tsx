import OrderView from "@/modules/orders/view/order-view";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.search || "";

  return <OrderView initialSearch={searchQuery} />;
}
