import assert from "node:assert";
import { z } from "zod";
import { updateSellerSettingsSchema } from "../modules/seller-profile/validations/update-seller-settings-schema";
import { bankAccountSchema } from "../modules/seller-profile/lib/bank-account-schema";
import { canSubmitVerification } from "../modules/seller-profile/lib/can-submit-verification";
import { calculateVerificationProgress } from "../modules/seller-profile/lib/calculate-verification-progress";
import {
  extractPanFromGst,
  doesPanMatchGst,
  GSTIN_REGEX,
  PAN_REGEX,
} from "../modules/seller-profile/lib/gst-pan-helpers";
import { SellerDocumentDto, SellerVerificationDto } from "../modules/seller-profile/dto";

function testSellerSettingsValidation() {
  console.log("--> Testing Seller Settings DTO Validations...");

  // 1. Valid settings payload
  const validSettings = {
    languageCode: "en",
    currencyCode: "INR",
    timezone: "Asia/Kolkata",
    theme: "DARK" as const,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingNotifications: false,
    orderNotifications: true,
    payoutNotifications: true,
    lowInventoryNotifications: true,
  };

  const parsed = updateSellerSettingsSchema.parse(validSettings);
  assert.strictEqual(parsed.currencyCode, "INR");
  assert.strictEqual(parsed.theme, "DARK");
  assert.strictEqual(parsed.orderNotifications, true);

  // 2. Reject invalid theme
  assert.throws(
    () => {
      updateSellerSettingsSchema.parse({
        ...validSettings,
        theme: "NEON_GLOW",
      });
    },
    (err: unknown) => err instanceof z.ZodError,
    "Should reject unsupported theme values"
  );

  // 3. Reject invalid currency code length
  assert.throws(
    () => {
      updateSellerSettingsSchema.parse({
        ...validSettings,
        currencyCode: "RUPEES",
      });
    },
    (err: unknown) => err instanceof z.ZodError,
    "Should reject currency codes with length other than 3"
  );

  // 4. Reject missing notification boolean flags
  assert.throws(
    () => {
      const invalid = { ...validSettings };
      delete (invalid as Record<string, unknown>).emailNotifications;
      updateSellerSettingsSchema.parse(invalid);
    },
    (err: unknown) => err instanceof z.ZodError,
    "Should require all notification boolean flags"
  );

  console.log("✓ Seller Settings validation tests passed.");
}

function testGstAndPanRelationalIntegrity() {
  console.log("--> Testing GSTIN and PAN Relational Extraction & Verification...");

  const validGstin = "27ABCDE1234F1Z5";
  const expectedPan = "ABCDE1234F";

  assert.ok(GSTIN_REGEX.test(validGstin), "GSTIN should match standard Indian GSTIN regex");
  assert.ok(PAN_REGEX.test(expectedPan), "PAN should match standard Indian PAN regex");

  // Extract PAN from GSTIN
  const extractedPan = extractPanFromGst(validGstin);
  assert.strictEqual(extractedPan, expectedPan, "Extracted PAN should match chars 3-12 of GSTIN");

  // Verify PAN match
  assert.strictEqual(
    doesPanMatchGst(expectedPan, validGstin),
    true,
    "Exact matching PAN must return true"
  );
  assert.strictEqual(
    doesPanMatchGst(expectedPan.toLowerCase(), validGstin),
    true,
    "Case-insensitive PAN matching must return true"
  );
  assert.strictEqual(
    doesPanMatchGst("XYZAB5678M", validGstin),
    false,
    "Mismatched PAN must return false"
  );

  // Invalid GSTIN returns null
  assert.strictEqual(extractPanFromGst("INVALID_GSTIN"), null);
  assert.strictEqual(extractPanFromGst("27ABCDE1234F1Z"), null); // only 14 chars

  console.log("✓ GSTIN & PAN relational integrity tests passed.");
}

function testSellerBankAccountValidation() {
  console.log("--> Testing Seller Bank Account Schema Validations...");

  const validBankAccount = {
    accountHolderName: "Arman Alam",
    bankName: "HDFC Bank",
    accountNumber: "50100234567890",
    confirmAccountNumber: "50100234567890",
    ifscCode: "HDFC0001234",
    branchName: "Kolkata Main Branch",
    accountType: "CURRENT" as const,
  };

  const parsed = bankAccountSchema.parse(validBankAccount);
  assert.strictEqual(parsed.accountHolderName, "Arman Alam");
  assert.strictEqual(parsed.ifscCode, "HDFC0001234");

  // Rejection when account numbers do not match
  assert.throws(
    () => {
      bankAccountSchema.parse({
        ...validBankAccount,
        confirmAccountNumber: "50100999999999",
      });
    },
    (err: unknown) => err instanceof z.ZodError,
    "Should reject non-matching account numbers"
  );

  // Rejection for invalid IFSC code format
  assert.throws(
    () => {
      bankAccountSchema.parse({
        ...validBankAccount,
        ifscCode: "INVALID_IFSC",
      });
    },
    (err: unknown) => err instanceof z.ZodError,
    "Should reject invalid IFSC code format"
  );

  console.log("✓ Seller Bank Account validation tests passed.");
}

function testVerificationSubmissionAndProgress() {
  console.log("--> Testing Seller Verification Submission and Progress Logic...");

  const mockGstDoc: SellerDocumentDto = {
    id: "doc-1",
    sellerId: "seller-123",
    documentType: "GST",
    documentNumber: "27ABCDE1234F1Z5",
    documentName: "gst_cert.pdf",
    fileUrl: "https://example.com/gst.pdf",
    mimeType: "application/pdf",
    fileSizeBytes: 102400,
    status: "VERIFIED",
    verificationMethod: "MANUAL",
    verifiedAt: "2026-10-01T00:00:00Z",
    rejectionReason: null,
    expiresAt: null,
    isPrimary: true,
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  };

  const mockPanDoc: SellerDocumentDto = {
    id: "doc-2",
    sellerId: "seller-123",
    documentType: "PAN",
    documentNumber: "ABCDE1234F",
    documentName: "pan_card.jpg",
    fileUrl: "https://example.com/pan.jpg",
    mimeType: "image/jpeg",
    fileSizeBytes: 51200,
    status: "VERIFIED",
    verificationMethod: "MANUAL",
    verifiedAt: "2026-10-01T00:00:00Z",
    rejectionReason: null,
    expiresAt: null,
    isPrimary: true,
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  };

  const baseVerification: SellerVerificationDto = {
    verification: {
      // id: "ver-123",
      sellerId: "seller-123",
      status: "NOT_SUBMITTED",
      submittedAt: null,
      reviewNotes: null,
      verifiedAt: null,
      reviewStartedAt: null,
      rejectionReason: null,
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: "2026-10-01T00:00:00Z",
    },
    completionPercentage: 50,
    canSubmit: false,
    requiredDocumentsUploaded: 1,
    requiredDocumentsTotal: 2,
    documents: [mockGstDoc],
  };

  // 1. Missing PAN -> cannot submit
  assert.strictEqual(
    canSubmitVerification(baseVerification, [mockGstDoc]),
    false,
    "Should not allow submit when PAN is missing"
  );

  // 2. Both GST and PAN present -> can submit
  assert.strictEqual(
    canSubmitVerification(baseVerification, [mockGstDoc, mockPanDoc]),
    true,
    "Should allow submit when both GST and PAN are uploaded"
  );

  // 3. Status is already UNDER_REVIEW -> cannot submit again
  const underReviewVerification: SellerVerificationDto = {
    ...baseVerification,
    verification: {
      ...baseVerification.verification,
      status: "UNDER_REVIEW",
    },
  };
  assert.strictEqual(
    canSubmitVerification(underReviewVerification, [mockGstDoc, mockPanDoc]),
    false,
    "Should not allow submit when status is UNDER_REVIEW"
  );

  // 4. Verification Progress calculation
  const progressResult = calculateVerificationProgress(baseVerification);
  assert.strictEqual(progressResult.progress, 50);
  assert.strictEqual(progressResult.completed, false);
  assert.deepStrictEqual(progressResult.missingItems, [
    "Required verification documents",
  ]);

  // When fully verified
  const verifiedState: SellerVerificationDto = {
    ...baseVerification,
    completionPercentage: 100,
    canSubmit: false,
    verification: {
      ...baseVerification.verification,
      status: "VERIFIED",
    },
  };
  const verifiedProgress = calculateVerificationProgress(verifiedState);
  assert.strictEqual(verifiedProgress.progress, 100);
  assert.strictEqual(verifiedProgress.completed, true);

  console.log("✓ Verification submission and progress tests passed.");
}

function runAllProfileTests() {
  console.log("\n==========================================");
  console.log("  Running Seller Profile & Verification Tests");
  console.log("==========================================\n");

  testSellerSettingsValidation();
  testGstAndPanRelationalIntegrity();
  testSellerBankAccountValidation();
  testVerificationSubmissionAndProgress();

  console.log("\n All Seller Profile unit tests passed successfully!\n");
}

runAllProfileTests();
