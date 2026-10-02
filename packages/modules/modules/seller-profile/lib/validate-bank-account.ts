import {
    bankAccountSchema,
} from "./bank-account-schema";

export function validateBankAccount(
    input: unknown,
) {
    return bankAccountSchema.parse(
        input,
    );
}