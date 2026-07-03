import { CreateSellerAddressDto } from "../dto/seller-address.dto";
import { sellerAddresses } from "@/db/schema/seller/seller-address";
import { toSellerAddressForm } from "../mapper/seller-address-mapper";
import {DbTransaction} from "@/db/transactions";
import {getDatabase} from "@/db/database";

interface CreateSellerAddressParams {
    tx?: DbTransaction;
    sellerId: string;
    data: CreateSellerAddressDto;
}

export async function createSellerAddress({
  sellerId,
  data,
    tx
}: CreateSellerAddressParams) {
    const database = getDatabase(tx);

    const [address] = await database
    .insert(sellerAddresses)
    .values({
      sellerId,
      ...data,
      latitude: data.latitude ? String(data.latitude) : null,
      longitude: data.longitude ? String(data.longitude) : null,
    })
    .returning();

  return toSellerAddressForm(address);
}