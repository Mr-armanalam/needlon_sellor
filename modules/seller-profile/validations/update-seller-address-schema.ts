import { z } from "zod";
import {createSellerAddressSchema} from "@/modules/seller-profile/validations/create-seller-address-schema";

export const updateSellerAddressSchema = createSellerAddressSchema.partial();


// import { z } from "zod";
// import {createSellerAddressSchema} from "@/modules/seller-profile/validations/create-seller-address-schema";
//
// export const updateSellerAddressSchema = z.object({
//     id: z.uuid(),
//
//     data: createSellerAddressSchema.partial(),
// });