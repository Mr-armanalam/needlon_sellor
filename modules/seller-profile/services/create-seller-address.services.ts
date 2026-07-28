import {CreateSellerAddressDto} from "@/modules/seller-profile/dto";
import {createSellerAddress} from "@/modules/seller-profile/repositery";

interface CreateSellerAddressServiceInput {
    sellerId: string;
    data: CreateSellerAddressDto;
}

export async function createSellerAddressService({
                                                     sellerId,
                                                     data,
                                                 }: CreateSellerAddressServiceInput) {
    return createSellerAddress({
        sellerId,
        data,
    });
}









// import { db } from "@/db";
//
// import { getCurrentSellerOrThrow } from "@/modules/seller/services";
// import {countActiveSellerAddresses, createSellerAddress} from "@/modules/seller-profile/repositery";


// import {CreateSellerAddressDto} from "@/modules/seller-profile/dto/seller-address.dto";
// import {unsetDefaultAddress} from "@/modules/seller-profile/repositery/unset-default-address";
//
//
// export async function createSellerAddressService(
//     data: CreateSellerAddressDto,
// ) {
//     const seller = await getCurrentSellerOrThrow();
//
//     return db.transaction(async (tx) => {
//         const totalAddresses = await countActiveSellerAddresses({sellerId: seller.id});
//
//         const shouldBeDefault =
//             totalAddresses === 0 || data.isDefault;
//
//         if (shouldBeDefault) {
//             await unsetDefaultAddress({sellerId:seller.id});
//         }
//
//         return createSellerAddress({
//             sellerId: seller.id,
//             data: {
//                 ...data,
//                 isDefault: shouldBeDefault,
//             },
//         });
//     });
// }