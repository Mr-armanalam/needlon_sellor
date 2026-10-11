import "dotenv/config";
import assert from "node:assert";
import {
  createOrLinkWalkInCustomerRepo,
  createInStoreMeasurementRepo,
  createInStoreOrderRepo,
  updateTailoringStageRepo,
  getChatPermissionRepo,
  requestChatPermissionRepo,
  respondChatPermissionRepo,
  toggleChatPermissionRepo,
  canSellerMessageCustomerRepo,
  getCustomerDetailsRepo,
} from "../modules/customers/repository/customer.repository";
import { OrderRepository } from "../../client-packages/client-modules/orders/repositories/order-repository";

async function runPhase2TestSuite() {
  console.log("=== PHASE 2: IN-STORE BESPOKE ORDER, MILESTONES & PRIVACY CHAT TEST SUITE ===");

  const dummySellerId = "f836594d-fe63-4196-8782-6bb9cd04f615";
  const testCustomerEmail = `phase2_client_${Date.now()}@bespokeatelier.com`;

  // Step 1: Enroll walk-in customer
  console.log("--> 1. Enrolling Walk-in Customer...");
  const customer = await createOrLinkWalkInCustomerRepo(dummySellerId, {
    name: "Raghav Mehra",
    email: testCustomerEmail,
    phone: "+91 91234 56789",
    gender: "male",
    notes: "Walk-in client commissioning wedding tuxedo",
  });
  assert.ok(customer.userId);
  console.log(`✓ Customer enrolled with ID: ${customer.userId}`);

  // Step 2: Record in-store measurement
  console.log("--> 2. Recording In-Store Measurements...");
  const measurement = await createInStoreMeasurementRepo(dummySellerId, {
    userId: customer.userId,
    gender: "menswear",
    garmentType: "blazer",
    measurementUnit: "INCHES",
    essentialMeasurements: {
      chest_circumference: 41.5,
      waist_circumference: 35.0,
      shoulder_width: 18.5,
      sleeve_length: 33.0,
      jacket_length: 30.5,
    },
    fitPreference: "SLIM",
    tailorNotes: "Taper waist by 0.5 in; peak lapel design.",
  });
  assert.ok(measurement.id);
  console.log(`✓ Measurement profile recorded: ${measurement.id}`);

  // Step 3: Create In-Store Order
  console.log("--> 3. Creating In-Store Bespoke Order...");
  const bespokeOrder = await createInStoreOrderRepo(dummySellerId, {
    customerId: customer.userId,
    measurementId: measurement.id,
    garmentName: "Custom Black-Tie Peak Lapel Tuxedo",
    amount: 14500,
    tailoringStage: "ORDER_PLACED",
    tailoringNotes: "Italian superfine wool; lining in emerald green silk.",
    paymentStatus: "PAID",
    paymentMethod: "CARD",
  });

  assert.ok(bespokeOrder.id);
  assert.strictEqual(bespokeOrder.source, "IN_STORE");
  assert.strictEqual(bespokeOrder.tailoringStage, "ORDER_PLACED");
  assert.strictEqual(bespokeOrder.buyerId, customer.userId);
  console.log(`✓ In-Store Order created: ${bespokeOrder.orderNumber} (ID: ${bespokeOrder.id})`);

  // Step 4: Verify customer order history in seller details
  console.log("--> 4. Verifying Order in Seller Customer Details...");
  const details = await getCustomerDetailsRepo(dummySellerId, customer.userId);
  assert.ok(details.history.length >= 1);
  const foundInSeller = details.history.find(o => o.orderId === bespokeOrder.id);
  assert.ok(foundInSeller, "Order must be listed in seller customer history");
  assert.strictEqual(foundInSeller.source, "IN_STORE");
  assert.strictEqual(foundInSeller.tailoringStage, "ORDER_PLACED");
  console.log("✓ Order visible in seller customer history with tailoringStage=ORDER_PLACED.");

  // Step 5: Verify Order reflection in Client Personal Account
  console.log("--> 5. Verifying Order Reflection in Customer Personal Account...");
  const userOrders = await OrderRepository.getRawUserOrders(customer.userId);
  assert.ok(userOrders.length >= 1, "Order must appear in customer's personal account orders");
  const foundInClient = userOrders.find(o => o.orderId === bespokeOrder.id);
  assert.ok(foundInClient, "Matching in-store order found in customer orders list");
  console.log("✓ Order automatically reflected in customer personal account orders!");

  // Step 6: Advance Bespoke Tailoring Milestones
  console.log("--> 6. Advancing Tailoring Milestones to TRIAL_FITTING...");
  const updatedOrder = await updateTailoringStageRepo(dummySellerId, bespokeOrder.id, {
    stage: "TRIAL_FITTING",
    notes: "Baste fitting assembled; client scheduled for fitting Thursday at 4 PM.",
  });
  assert.strictEqual(updatedOrder.tailoringStage, "TRIAL_FITTING");
  console.log("✓ Tailoring stage advanced to TRIAL_FITTING.");

  // Step 7: Verify Live Tailoring Timeline in Customer Tracking
  console.log("--> 7. Verifying Live Tailoring Timeline in Customer Tracking...");
  const orderDetailRows = await OrderRepository.getOrderDetail(bespokeOrder.id, customer.userId);
  assert.ok(orderDetailRows && orderDetailRows.length > 0);
  const timeline = orderDetailRows[0].timeline;
  assert.ok(Array.isArray(timeline), "Timeline steps must exist");
  assert.strictEqual(timeline.length, 9, "Bespoke timeline must contain all 9 stages");

  // Stages through TRIAL_FITTING (index 4) must be active
  assert.strictEqual(timeline[0].isActive, true, "Commission Placed must be active");
  assert.strictEqual(timeline[1].isActive, true, "Measurements Verified must be active");
  assert.strictEqual(timeline[2].isActive, true, "Pattern Drafting must be active");
  assert.strictEqual(timeline[3].isActive, true, "Precision Cutting must be active");
  assert.strictEqual(timeline[4].isActive, true, "Trial / Baste Fitting must be active");
  assert.strictEqual(timeline[5].isActive, false, "Hand Stitching must be inactive");
  assert.ok(timeline[4].details.some((d: string) => d.includes("Thursday at 4 PM")), "Tailor notes must be present in milestone");
  console.log("✓ Customer tracking timeline accurately reflects live bespoke milestones!");

  // Step 8: Privacy-Protected Chat Permission State Machine
  console.log("--> 8. Testing Privacy Chat Permission Gate...");

  // Initial State: NOT_REQUESTED -> canMessage is false
  const initialPerm = await getChatPermissionRepo(dummySellerId, customer.userId);
  assert.strictEqual(initialPerm.canMessage, false, "Tailor CANNOT message customer without permission");
  assert.strictEqual(initialPerm.status, "NOT_REQUESTED");

  // Tailor requests chat
  console.log("--> Tailor requests chat permission from customer...");
  await requestChatPermissionRepo(dummySellerId, customer.userId, "Hello Raghav, we would like to coordinate your fitting timing.");
  const requestedPerm = await getChatPermissionRepo(dummySellerId, customer.userId);
  assert.strictEqual(requestedPerm.status, "REQUESTED");
  assert.strictEqual(requestedPerm.canMessage, false, "Tailor CANNOT message customer while request is pending");

  // Customer accepts chat request
  console.log("--> Customer accepts chat request in account...");
  await respondChatPermissionRepo(customer.userId, dummySellerId, "ACCEPTED");
  const acceptedPerm = await getChatPermissionRepo(dummySellerId, customer.userId);
  assert.strictEqual(acceptedPerm.status, "ACCEPTED");
  assert.strictEqual(acceptedPerm.isEnabled, true);
  assert.strictEqual(acceptedPerm.canMessage, true, "Tailor CAN message customer after acceptance");

  // Customer toggles off / revokes chat permission for privacy
  console.log("--> Customer revokes chat permission via privacy toggle...");
  await toggleChatPermissionRepo(customer.userId, dummySellerId, false);
  const disabledPerm = await getChatPermissionRepo(dummySellerId, customer.userId);
  assert.strictEqual(disabledPerm.isEnabled, false);
  assert.strictEqual(disabledPerm.canMessage, false, "Tailor CANNOT message when customer disables privacy toggle");

  // Customer re-enables chat permission
  console.log("--> Customer re-enables chat permission...");
  await toggleChatPermissionRepo(customer.userId, dummySellerId, true);
  const reenabledPerm = await getChatPermissionRepo(dummySellerId, customer.userId);
  assert.strictEqual(reenabledPerm.isEnabled, true);
  assert.strictEqual(reenabledPerm.canMessage, true, "Tailor CAN message when re-enabled");

  // Validate canSellerMessageCustomerRepo helper
  const canMessageHelper = await canSellerMessageCustomerRepo(dummySellerId, customer.userId);
  assert.strictEqual(canMessageHelper, true, "canSellerMessageCustomerRepo returns true");

  console.log("✓ Privacy chat permission gate state machine validated completely!");
  console.log("=== ALL PHASE 2 TESTS PASSED PERFECTLY ===");
  process.exit(0);
}

runPhase2TestSuite().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

