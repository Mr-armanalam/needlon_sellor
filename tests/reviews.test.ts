import assert from "node:assert";
import { listReviewsQuerySchema } from "../modules/review/schema/list-reviews-query-schema";
import { reportReviewSchema } from "../modules/review/schema/report-review-schema";
import { createReviewResponseSchema } from "../modules/review/schema/review-response-schema";
import { toReviewDto } from "../modules/review/dto/to-review.dto";

function testValidationSchemas() {
  console.log("--> Testing Zod validations for reviews...");

  // Test List Reviews Query Schema
  const validQuery = {
    page: "2",
    limit: "15",
    search: "great product",
    rating: "5"
  };
  const parsedQuery = listReviewsQuerySchema.parse(validQuery);
  assert.strictEqual(parsedQuery.page, 2);
  assert.strictEqual(parsedQuery.limit, 15);
  assert.strictEqual(parsedQuery.search, "great product");
  assert.strictEqual(parsedQuery.rating, 5);

  const defaultQuery = listReviewsQuerySchema.parse({});
  assert.strictEqual(defaultQuery.page, 1);
  assert.strictEqual(defaultQuery.limit, 20);

  assert.throws(() => {
    listReviewsQuerySchema.parse({ rating: 6 });
  });

  // Test Report Review Schema
  const validReport = {
    reviewId: "123e4567-e89b-12d3-a456-426614174000",
    reason: "Inappropriate content"
  };
  const parsedReport = reportReviewSchema.parse(validReport);
  assert.strictEqual(parsedReport.reviewId, "123e4567-e89b-12d3-a456-426614174000");
  assert.strictEqual(parsedReport.reason, "Inappropriate content");

  assert.throws(() => {
    reportReviewSchema.parse({ reviewId: "invalid-uuid", reason: "Short" });
  });

  // Test Create Response Schema
  const validResponse = {
    reviewId: "123e4567-e89b-12d3-a456-426614174000",
    content: "Thank you for your feedback!"
  };
  const parsedResponse = createReviewResponseSchema.parse(validResponse);
  assert.strictEqual(parsedResponse.reviewId, "123e4567-e89b-12d3-a456-426614174000");
  assert.strictEqual(parsedResponse.content, "Thank you for your feedback!");

  assert.throws(() => {
    createReviewResponseSchema.parse({ reviewId: "invalid-uuid", content: "" });
  });

  console.log("✓ Zod validation tests passed.");
}

function testReviewMapper() {
  console.log("--> Testing Review DTO Mapper...");

  const mockDbReview = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    sellerId: "223e4567-e89b-12d3-a456-426614174000",
    buyerId: "323e4567-e89b-12d3-a456-426614174000",
    productId: "423e4567-e89b-12d3-a456-426614174000",
    rating: 4,
    title: "Very Nice",
    content: "Highly recommended, fits great.",
    status: "PUBLISHED" as const,
    createdAt: new Date("2026-08-10T10:00:00Z"),
    updatedAt: new Date("2026-08-10T10:05:00Z"),
    reply: "Thank you for the kind words!",
    buyer: {
      id: "323e4567-e89b-12d3-a456-426614174000",
      name: "Jane Smith",
      email: "jane@example.com",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    },
    product: {
      id: "423e4567-e89b-12d3-a456-426614174000",
      name: "Leather Sandals",
      slug: "leather-sandals"
    }
  };

  const responseDto = toReviewDto(mockDbReview);

  assert.strictEqual(responseDto.id, mockDbReview.id);
  assert.strictEqual(responseDto.rating, 4);
  assert.strictEqual(responseDto.title, "Very Nice");
  assert.strictEqual(responseDto.reply, "Thank you for the kind words!");
  assert.strictEqual(responseDto.buyer.name, "Jane Smith");
  assert.strictEqual(responseDto.product.slug, "leather-sandals");

  console.log("✓ Review DTO mapper tests passed.");
}

function runAllTests() {
  console.log("=== REVIEWS TEST SUITE ===");
  testValidationSchemas();
  testReviewMapper();
  console.log("=== ALL REVIEWS UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
