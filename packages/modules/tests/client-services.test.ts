import assert from "node:assert";
import { AddressService } from "../../client-packages/client-modules/account/services/address-service";
import { CartService } from "../../client-packages/client-modules/cart/services/cart-service";
import { WishlistService } from "../../client-packages/client-modules/account/services/wishlist-service";

async function runClientServicesTests() {
  console.log("--> Running unit tests for Client Backend Services...");

  // 1. AddressService Tests
  const mockUserId = "test-user-123";
  const addressData = {
    fullName: "John Doe",
    phone: "+919876543210",
    addressLine1: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    isDefault: true,
  };

  const createdAddress = await AddressService.addAddress(mockUserId, addressData);
  assert.ok(createdAddress, "Address should be created");
  assert.strictEqual(createdAddress.fullName, "John Doe");

  const addresses = await AddressService.getUserAddresses(mockUserId);
  assert.ok(Array.isArray(addresses), "Addresses should be an array");

  const deleteResult = await AddressService.deleteAddress(mockUserId, "mock-addr-id");
  assert.strictEqual(deleteResult, true, "Delete address should return true");

  // 2. CartService Tests
  const cartItems = await CartService.getCart(mockUserId);
  assert.ok(Array.isArray(cartItems), "Cart items should return array");

  const addedCartItem = await CartService.addToCart(mockUserId, {
    productId: "p-101",
    quantity: 2,
    size: "M",
  });
  assert.ok(addedCartItem, "Item should be added to cart");

  const updateResult = await CartService.updateQuantity("mock-item-id", 3);
  assert.strictEqual(updateResult, true, "Update cart item quantity should return true");

  const removeResult = await CartService.removeFromCart("mock-item-id");
  assert.strictEqual(removeResult, true, "Remove from cart should return true");

  // 3. WishlistService Tests
  const wishlist = await WishlistService.getWishlist(mockUserId);
  assert.ok(Array.isArray(wishlist), "Wishlist should return array");

  const toggleResult = await WishlistService.toggleWishlist(mockUserId, "p-101");
  assert.ok("added" in toggleResult, "Toggle wishlist should return status");

  console.log("✓ All Client Backend Services tests passed successfully!");
}

runClientServicesTests().catch((err) => {
  console.error("❌ Test execution failed:", err);
  process.exit(1);
});
