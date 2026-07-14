import {sellerBankAccounts} from "@/db/schema/seller/seller-bank-account";

type SellerBankAccountRecord =
    typeof sellerBankAccounts.$inferSelect;

export const toSellerBankUPI_DTO = (upi_details: SellerBankAccountRecord) => {
   return {
       accountId: upi_details.id,
       upiId: upi_details.upiId,
       sellerId: upi_details.sellerId,
   }
}
