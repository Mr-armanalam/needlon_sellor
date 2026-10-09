import { NextRequest, NextResponse } from "next/server";
import { AddressService } from "@/modules/account/services/address-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "mock-user";
    const addresses = await AddressService.getUserAddresses(userId);
    return NextResponse.json({ success: true, addresses }, { status: 200 });
  } catch (error) {
    console.error("GET_ADDRESSES_ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "mock-user";
    const addrObj = body.data || body;

    const dto = {
      fullName: addrObj.fullName || addrObj.name || "Customer",
      phone: addrObj.phone || "",
      addressLine1: addrObj.addressLine1 || addrObj.address || addrObj.locality || "Address",
      addressLine2: addrObj.addressLine2 || addrObj.landmark,
      city: addrObj.city || "",
      state: addrObj.state || "",
      postalCode: addrObj.postalCode || addrObj.pincode || "",
      country: addrObj.country || "India",
      addressType: addrObj.addressType || "HOME",
      isDefault: Boolean(addrObj.isDefault),
    };

    const inserted = await AddressService.addAddress(userId, dto);
    return NextResponse.json({ success: true, address: inserted }, { status: 200 });
  } catch (error) {
    console.error("POST_ADDRESS_ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to add address" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || body.userId || "mock-user";
    const addressId = body.id || searchParams.get("id");

    if (!addressId) {
      return NextResponse.json({ success: false, message: "Address ID required" }, { status: 400 });
    }

    await AddressService.deleteAddress(userId, addressId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE_ADDRESS_ERROR:", error);
    return NextResponse.json({ success: false, message: "Failed to delete address" }, { status: 500 });
  }
}
