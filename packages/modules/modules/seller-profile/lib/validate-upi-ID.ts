import {upiIDSchema} from "@/modules/seller-profile/validations/upi-id-schema";


export function validateUpiId(
    input: unknown,
) {
    return upiIDSchema.parse(
        input,
    );
}