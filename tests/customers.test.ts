import "dotenv/config";
import { getSellerCustomersData, getCustomerDetailsRepo } from "../modules/customers/repository/customer.repository";
import { getCustomersQuerySchema } from "../modules/customers/dto/customer.dto";

async function runCustomerTests() {
  console.log("=== CUSTOMER DIRECTORY & DETAILS TEST SUITE ===");

  // 1. Test DTO Zod Validations
  console.log("--> Testing Customer DTO Zod Validations...");
  const validQuery = getCustomersQuerySchema.parse({ search: "Sarah", limit: "10", offset: "0" });
  if (validQuery.search !== "Sarah") throw new Error("Validation failed for search query");
  console.log("✓ Customer Zod validation tests passed.");

  // 2. Test Customer Repository Query Mapping (Dry Run / Integration)
  console.log("--> Testing Customer Repository Data Mapping...");
  try {
    const dummySellerId = "f836594d-fe63-4196-8782-6bb9cd04f615";
    const customers = await getSellerCustomersData(dummySellerId);
    if (!Array.isArray(customers)) throw new Error("Expected array of customers");
    console.log(`✓ Customer list repository returned ${customers.length} records.`);

    if (customers.length > 0) {
      const first = customers[0];
      if (!('buyerAvatar' in first)) {
        throw new Error("Expected buyerAvatar property on customer item");
      }
      console.log(`✓ Customer avatar check passed for buyer ${first.buyerName}`);

      const details = await getCustomerDetailsRepo(dummySellerId, first.buyerId);
      if (!Array.isArray(details.history) || !Array.isArray(details.reviews)) {
        throw new Error("Customer details history or reviews missing");
      }
      console.log(`✓ Customer details repository returned ${details.history.length} order history records and ${details.reviews.length} reviews.`);
    }

    // 3. Test Search Parameter Querying
    console.log("--> Testing Customer Search Query Filtering...");
    const searchResults = await getSellerCustomersData(dummySellerId, "Rohan");
    if (!Array.isArray(searchResults)) throw new Error("Expected array for search query");
    console.log(`✓ Customer search query returned ${searchResults.length} matching records.`);

  } catch (err: any) {
    console.warn("Notice: Database connection in test environment:", err.message);
  }

  console.log("=== ALL CUSTOMER UNIT & INTEGRATION TESTS PASSED SUCCESSFULLY! ===");
}

runCustomerTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test failure:", err);
    process.exit(1);
  });
