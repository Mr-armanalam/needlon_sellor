import { NextResponse } from "next/server";

export const PATCH = async () => {
  return NextResponse.json({ success: true }, { status: 200 });
};
