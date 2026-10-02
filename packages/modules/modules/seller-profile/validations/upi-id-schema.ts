import { z } from "zod";

import {isValidUpiFormat} from "@/modules/seller-profile/lib/isvalid-upi-formate";

export const upiIDSchema =
    z.object({
        accountId: z.uuid(),
        upiId: z.string().trim().min(5).max(255),
        // bankName: z.string().trim().min(1).max(255),
    })
        .refine(
            (data) =>
                isValidUpiFormat(data.upiId),
            {
                path: [
                    "upiId",
                ],
                message:
                    "Invalid UPI ID format.",
            },
        );

export type UpiIdFormValues =
    z.infer<
        typeof upiIDSchema
    >;