import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { OrderService } from "@/modules/orders/services/orderServices";
import { groupOrderItems } from "@/modules/orders/services/orderTransformer";


export async function GET(req: Request) {
  try {
    //  Auth Check
    const session = await auth();
    const userId = session?.user?.id ?? "mock-user";

    // Param Extraction
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";

    // Fetch & Transform
    const rawOrders = await OrderService.getRawUserOrders(userId, search);
    const groupedOrders = groupOrderItems(rawOrders);

    return NextResponse.json(groupedOrders, { status: 200 });

  } catch (error) {
    console.error("ORDER_GET_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}