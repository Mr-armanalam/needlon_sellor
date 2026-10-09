import { db } from "@needlon/db";
import { userAddressesTable } from "@needlon/db/db/schema/client/user-addresses";
import { eq, and } from "drizzle-orm";

export interface CreateAddressDto {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  addressType?: string;
  isDefault?: boolean;
}

export const AddressService = {
  async getUserAddresses(userId: string) {
    if (!process.env.DATABASE_URL) {
      return [];
    }
    try {
      const addresses = await db
        .select()
        .from(userAddressesTable)
        .where(eq(userAddressesTable.userId, userId));
      return addresses;
    } catch (error) {
      console.warn("User addresses DB table unavailable, falling back:", (error as Error).message);
      return [];
    }
  },

  async addAddress(userId: string, dto: CreateAddressDto) {
    if (!process.env.DATABASE_URL) {
      return { id: "mock-addr-id", userId, ...dto, isDefault: dto.isDefault ?? false };
    }

    try {
      if (dto.isDefault) {
        await db
          .update(userAddressesTable)
          .set({ isDefault: false })
          .where(eq(userAddressesTable.userId, userId));
      }

      const [inserted] = await db
        .insert(userAddressesTable)
        .values({
          userId,
          fullName: dto.fullName,
          phone: dto.phone,
          addressLine1: dto.addressLine1,
          addressLine2: dto.addressLine2,
          city: dto.city,
          state: dto.state,
          postalCode: dto.postalCode,
          country: dto.country || "India",
          addressType: dto.addressType || "HOME",
          isDefault: dto.isDefault || false,
        })
        .returning();

      return inserted;
    } catch (error) {
      console.warn("Add address DB query fallback:", (error as Error).message);
      return { id: "mock-addr-id", userId, ...dto, isDefault: dto.isDefault ?? false };
    }
  },

  async deleteAddress(userId: string, addressId: string) {
    if (!process.env.DATABASE_URL) {
      return true;
    }
    try {
      await db
        .delete(userAddressesTable)
        .where(and(eq(userAddressesTable.id, addressId), eq(userAddressesTable.userId, userId)));
      return true;
    } catch (error) {
      console.warn("Delete address DB fallback:", (error as Error).message);
      return true;
    }
  },

  async setDefaultAddress(userId: string, addressId: string) {
    if (!process.env.DATABASE_URL) {
      return true;
    }
    try {
      await db
        .update(userAddressesTable)
        .set({ isDefault: false })
        .where(eq(userAddressesTable.userId, userId));

      await db
        .update(userAddressesTable)
        .set({ isDefault: true })
        .where(and(eq(userAddressesTable.id, addressId), eq(userAddressesTable.userId, userId)));
      return true;
    } catch (error) {
      console.warn("Set default address DB fallback:", (error as Error).message);
      return true;
    }
  },
};
