import { getCurrentSellerOrThrow } from "@/modules/seller-profile/services/get-current-seller-or-throw";
import {
  getSubscriptionPlansList,
  getSellerCurrentSubscription,
  updateSellerSubscriptionPlan,
  getSellerBillingLedger,
  getInvoicePdfData,
} from "../repository/subscription.repository";
import { UpdateSubscriptionDto, BillingLedgerQueryDto } from "../dto/subscription.dto";

export async function getSubscriptionPlansService() {
  return getSubscriptionPlansList();
}

export async function getSellerSubscriptionService() {
  const seller = await getCurrentSellerOrThrow();
  return getSellerCurrentSubscription(seller.id);
}

export async function updateSellerSubscriptionService(dto: UpdateSubscriptionDto) {
  const seller = await getCurrentSellerOrThrow();
  return updateSellerSubscriptionPlan(seller.id, dto);
}

export async function getSellerBillingLedgerService(dto: BillingLedgerQueryDto) {
  const seller = await getCurrentSellerOrThrow();
  return getSellerBillingLedger(seller.id, dto.tab);
}

export async function downloadInvoiceReceiptService(invoiceId: string) {
  const seller = await getCurrentSellerOrThrow();
  const invoice = await getInvoicePdfData(seller.id, invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found or unauthorized");
  }

  // Generate clean plaintext/receipt document
  const receiptContent = [
    "===========================================================",
    "                     NEEDLON MARKETPLACE                   ",
    "               SUBSCRIPTION TAX INVOICE & RECEIPT          ",
    "===========================================================",
    `Invoice Number  : ${invoice.invoiceNumber}`,
    `Date of Issue   : ${new Date(invoice.issuedAt || invoice.createdAt).toLocaleDateString()}`,
    `Plan Subscribed : ${invoice.planNameSnapshot}`,
    `Billing Period  : ${new Date(invoice.billingPeriodStart).toLocaleDateString()} to ${new Date(invoice.billingPeriodEnd).toLocaleDateString()}`,
    `Status          : ${invoice.status}`,
    "-----------------------------------------------------------",
    `Subtotal        : ${invoice.currencyCode} ${parseFloat(invoice.subtotal).toFixed(2)}`,
    `Tax (GST 18%)   : ${invoice.currencyCode} ${parseFloat(invoice.taxAmount || "0").toFixed(2)}`,
    `Total Paid      : ${invoice.currencyCode} ${parseFloat(invoice.totalAmount).toFixed(2)}`,
    "-----------------------------------------------------------",
    "Payment Gateway : Stripe Test Mode / Needlon Secure Pay    ",
    "Thank you for powering your business with Needlon!         ",
    "===========================================================",
  ].join("\r\n");

  return {
    filename: `${invoice.invoiceNumber}_Receipt.txt`,
    content: receiptContent,
  };
}
