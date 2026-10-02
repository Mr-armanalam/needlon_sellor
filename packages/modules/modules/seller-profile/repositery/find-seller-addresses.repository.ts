
import { db } from "@/db";
import {toSellerAddressForm} from "@/modules/seller-profile/mapper/seller-address-mapper";
import {sellerAddresses} from "@/db/schema/seller/seller-address";
import { and, asc, eq, isNull } from "drizzle-orm";


export async function findSellerAddresses(sellerId: string) {
    const addresses = await db.query.sellerAddresses.findMany({
        where: and(
            eq(sellerAddresses.sellerId, sellerId),
            isNull(sellerAddresses.deletedAt),
        ),

        orderBy: [
            asc(sellerAddresses.isDefault),
            asc(sellerAddresses.createdAt),
        ],
    });

    return addresses.map(toSellerAddressForm);
}
