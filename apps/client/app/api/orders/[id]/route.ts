import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { OrderService } from "@/modules/orders/services/orderServices";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message;
    return typeof message === "string" ? message : "";
  }
  return "";
}

function getErrorStatusCode(error: unknown): number {
  if (typeof error === "object" && error !== null && "statusCode" in error) {
    const statusCode = (error as { statusCode: unknown }).statusCode;
    return typeof statusCode === "number" ? statusCode : 500;
  }
  return 500;
}


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    if (!orderId) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;

    const orderDetail = await OrderService.getOrderDetail(orderId, userId);
    if (!orderDetail) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(orderDetail, { status: 200 });
  } catch (error) {
    if (getErrorStatusCode(error) === 403 || getErrorMessage(error).includes("UNAUTHORIZED")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have access to this order" },
        { status: 403 }
      );
    }
    console.error("ORDER_GET_BY_ID_ERROR:", error);
    return NextResponse.json({ error: "Failed to retrieve order" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    if (!orderId) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, reason } = body;

    if (action === "cancel") {
      const result = await OrderService.cancelOrder(
        orderId,
        userId || "mock-user",
        reason
      );
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: cancel" },
      { status: 400 }
    );
  } catch (error) {
    const statusCode = getErrorStatusCode(error);
    return NextResponse.json(
      { error: getErrorMessage(error) || "Failed to update order" },
      { status: statusCode }
    );
  }
}
