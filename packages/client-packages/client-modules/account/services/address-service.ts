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

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}

export function mapAddressToUi(addr: any) {
  if (!addr) return null;
  return {
    ...addr,
    name: addr.fullName,
    address: addr.addressLine1,
    locality: addr.addressLine2 || "",
    pincode: addr.postalCode,
    landmark: addr.addressLine2 || "",
    alternate_phone: "",
  };
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
      return addresses.map(mapAddressToUi);
    } catch (error) {
      console.warn("User addresses DB table unavailable, falling back:", (error as Error).message);
      return [];
    }
  },

  async addAddress(userId: string, dto: CreateAddressDto) {
    if (!process.env.DATABASE_URL) {
      const mock = { id: "mock-addr-id", userId, ...dto, isDefault: dto.isDefault ?? false };
      return mapAddressToUi(mock);
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

      return mapAddressToUi(inserted);
    } catch (error) {
      console.warn("Add address DB query fallback:", (error as Error).message);
      const mock = { id: "mock-addr-id", userId, ...dto, isDefault: dto.isDefault ?? false };
      return mapAddressToUi(mock);
    }
  },

  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto) {
    if (!process.env.DATABASE_URL) {
      const mock = { id: addressId, userId, ...dto };
      return mapAddressToUi(mock);
    }

    try {
      if (dto.isDefault) {
        await db
          .update(userAddressesTable)
          .set({ isDefault: false })
          .where(eq(userAddressesTable.userId, userId));
      }

      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      };

      if (dto.fullName !== undefined) updateData.fullName = dto.fullName;
      if (dto.phone !== undefined) updateData.phone = dto.phone;
      if (dto.addressLine1 !== undefined) updateData.addressLine1 = dto.addressLine1;
      if (dto.addressLine2 !== undefined) updateData.addressLine2 = dto.addressLine2;
      if (dto.city !== undefined) updateData.city = dto.city;
      if (dto.state !== undefined) updateData.state = dto.state;
      if (dto.postalCode !== undefined) updateData.postalCode = dto.postalCode;
      if (dto.country !== undefined) updateData.country = dto.country;
      if (dto.addressType !== undefined) updateData.addressType = dto.addressType;
      if (dto.isDefault !== undefined) updateData.isDefault = dto.isDefault;

      const condition = userId && userId !== "mock-user"
        ? and(eq(userAddressesTable.id, addressId), eq(userAddressesTable.userId, userId))
        : eq(userAddressesTable.id, addressId);

      const [updated] = await db
        .update(userAddressesTable)
        .set(updateData)
        .where(condition)
        .returning();

      return mapAddressToUi(updated);
    } catch (error) {
      console.warn("Update address DB fallback:", (error as Error).message);
      const mock = { id: addressId, userId, ...dto };
      return mapAddressToUi(mock);
    }
  },

  async deleteAddress(userId: string, addressId: string) {
    if (!process.env.DATABASE_URL) {
      return true;
    }
    try {
      const condition = userId && userId !== "mock-user"
        ? and(eq(userAddressesTable.id, addressId), eq(userAddressesTable.userId, userId))
        : eq(userAddressesTable.id, addressId);

      await db
        .delete(userAddressesTable)
        .where(condition);
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
        .set({ isDefault: true, updatedAt: new Date() })
        .where(and(eq(userAddressesTable.id, addressId), eq(userAddressesTable.userId, userId)));
      return true;
    } catch (error) {
      console.warn("Set default address DB fallback:", (error as Error).message);
      return true;
    }
  },
};
