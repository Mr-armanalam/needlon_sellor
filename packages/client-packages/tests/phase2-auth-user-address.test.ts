import assert from "node:assert";
import crypto from "node:crypto";
import { db } from "../../db/db";
import { usersTable } from "../../db/db/schema/users";
import { eq } from "drizzle-orm";
import { AddressService } from "../client-modules/account/services/address-service";
import { UserService } from "../client-modules/account/services/user-service";

async function runPhase2Tests() {
  console.log("--> Running Phase 2 Tests: Auth, User Profile & Saved Addresses (Live DB Integration)...");

  const testUserId = crypto.randomUUID();
  const testEmail = `phase2-test-${Date.now()}@needlon-test.com`;

  // 1. Create temporary test user in usersTable
  console.log("1. Creating temporary test user in database...");
  const [createdUser] = await db
    .insert(usersTable)
    .values({
      id: testUserId,
      name: "Phase2 Test User",
      email: testEmail,
      number: "+919876543210",
      gender: "male",
    })
    .returning();

  assert.ok(createdUser, "Test user should be inserted");
  assert.strictEqual(createdUser.id, testUserId, "User ID should match");
  console.log(`✓ Test user created with ID: ${testUserId}`);

  try {
    // 2. Test AddressService.addAddress
    console.log("2. Testing AddressService.addAddress...");
    const newAddr = await AddressService.addAddress(testUserId, {
      fullName: "Priya Sharma",
      phone: "+919876543210",
      addressLine1: "Flat 302, Green Meadows",
      addressLine2: "Near Metro Station",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560001",
      country: "India",
      addressType: "HOME",
      isDefault: true,
    });

    assert.ok(newAddr, "Address should be returned");
    assert.strictEqual(newAddr.fullName, "Priya Sharma");
    assert.strictEqual(newAddr.name, "Priya Sharma", "UI alias name should match");
    assert.strictEqual(newAddr.pincode, "560001", "UI alias pincode should match");
    assert.strictEqual(newAddr.address, "Flat 302, Green Meadows", "UI alias address should match");
    assert.strictEqual(newAddr.isDefault, true, "First address should be default");
    console.log(`✓ Address added to DB with ID: ${newAddr.id}`);

    // 3. Test AddressService.getUserAddresses
    console.log("3. Testing AddressService.getUserAddresses...");
    const addresses = await AddressService.getUserAddresses(testUserId);
    assert.ok(Array.isArray(addresses), "Should return array of addresses");
    assert.strictEqual(addresses.length, 1, "Should have 1 address in database");
    assert.strictEqual(addresses[0].id, newAddr.id);
    console.log("✓ Live address query verified.");

    // 4. Test AddressService.updateAddress
    console.log("4. Testing AddressService.updateAddress...");
    const updatedAddr = await AddressService.updateAddress(testUserId, newAddr.id, {
      fullName: "Priya Sharma Updated",
      city: "Bengaluru East",
    });
    assert.ok(updatedAddr, "Updated address returned");
    assert.strictEqual(updatedAddr.fullName, "Priya Sharma Updated");
    assert.strictEqual(updatedAddr.city, "Bengaluru East");
    console.log("✓ Live address update verified.");

    // 5. Test AddressService.setDefaultAddress
    console.log("5. Testing AddressService.setDefaultAddress...");
    const defaultRes = await AddressService.setDefaultAddress(testUserId, newAddr.id);
    assert.strictEqual(defaultRes, true, "Set default should return true");
    console.log("✓ Live setDefaultAddress verified.");

    // 6. Test UserService.getUserProfile
    console.log("6. Testing UserService.getUserProfile...");
    const profile = await UserService.getUserProfile(testUserId);
    assert.ok(profile, "User profile should be returned");
    assert.strictEqual(profile.email, testEmail);
    assert.strictEqual(profile.name, "Phase2 Test User");
    console.log("✓ Live getUserProfile verified.");

    // 7. Test UserService.updateUserProfile
    console.log("7. Testing UserService.updateUserProfile...");
    const updateProfileRes = await UserService.updateUserProfile(testUserId, {
      name: "Phase2 Updated Name",
      phone: "+919988776655",
      gender: "female",
    });
    assert.ok(updateProfileRes.success, "Profile update should succeed");
    assert.strictEqual(updateProfileRes.user.name, "Phase2 Updated Name");
    assert.strictEqual(updateProfileRes.user.gender, "female");
    console.log("✓ Live updateUserProfile verified.");

    // 8. Test UserService.getUserByEmail
    console.log("8. Testing UserService.getUserByEmail...");
    const userByEmail = await UserService.getUserByEmail(testEmail);
    assert.ok(userByEmail, "Should find user by email in DB");
    assert.strictEqual(userByEmail?.id, testUserId);
    console.log("✓ Live getUserByEmail verified.");

    // 9. Test AddressService.deleteAddress
    console.log("9. Testing AddressService.deleteAddress...");
    const deleteRes = await AddressService.deleteAddress(testUserId, newAddr.id);
    assert.strictEqual(deleteRes, true, "Delete should succeed");
    const remainingAddresses = await AddressService.getUserAddresses(testUserId);
    assert.strictEqual(remainingAddresses.length, 0, "Address should be removed from DB");
    console.log("✓ Live deleteAddress verified.");

  } finally {
    // Clean up test user (cascades to any remaining client records)
    console.log("10. Cleaning up test user...");
    await db.delete(usersTable).where(eq(usersTable.id, testUserId));
    console.log("✓ Test user cleanup completed.");
  }

  console.log("=== All Phase 2 Integration Tests Passed Successfully! ===");
  process.exit(0);
}

runPhase2Tests().catch((err) => {
  console.error("Phase 2 test failed:", err);
  process.exit(1);
});
