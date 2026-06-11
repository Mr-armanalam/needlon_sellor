import { db } from "@/db";
import { productItems } from "@/db/schema/product-items";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    // const { userId } = await req.json();

    const [data] = await db
      .select()
      .from(productItems)
      .limit(3)

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
};
