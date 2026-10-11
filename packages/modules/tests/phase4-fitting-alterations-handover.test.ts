import "dotenv/config";
import assert from "node:assert";
import {
  createOrLinkWalkInCustomerRepo,
  createInStoreOrderRepo,
  updateTailoringStageRepo,
  scheduleFittingAppointmentRepo,
  getFittingAppointmentsRepo,
  updateFittingAppointmentRepo,
  recordInStoreHandoverRepo,
} from "../modules/customers/repository/customer.repository";
import { NotificationService } from "../../client-packages/client-modules/notification/services/notification-service";

async function runPhase4TestSuite() {
  console.log("=== PHASE 4: IN-STORE TRIAL FITTING, ALTERATIONS & HANDOVER TEST SUITE ===");

  const dummySellerId = "f836594d-fe63-4196-8782-6bb9cd04f615";
  const testCustomerEmail = `phase4_client_${Date.now()}@bespokeatelier.com`;

  // Step 1: Enroll walk-in customer
  console.log("--> 1. Enrolling Walk-in Customer for Bespoke Suit...");
  const customer = await createOrLinkWalkInCustomerRepo(dummySellerId, {
    name: "Aditya Roy Kapur",
    email: testCustomerEmail,
    phone: "+91 97777 66666",
    gender: "male",
    notes: "Bespoke Italian Charcoal Wool Double-Breasted Suit",
  });
  assert.ok(customer.userId);
  console.log(`✓ Customer enrolled with ID: ${customer.userId}`);

  // Step 2: Create in-store bespoke order
  console.log("--> 2. Placing In-Store Bespoke Order...");
  const order = await createInStoreOrderRepo(dummySellerId, {
    customerId: customer.userId,
    garmentName: "Italian Super 140s Double-Breasted Charcoal Suit",
    amount: 34000,
    advancePaid: 17000,
    paymentStatus: "PENDING",
    paymentMethod: "COD",
    tailoringNotes: "Full canvas construction with horn buttons.",
  });
  assert.ok(order.id);
  console.log(`✓ In-Store Bespoke Order created: ${order.orderNumber}`);

  // Step 3: Schedule In-Store Trial Fitting Session
  console.log("--> 3. Scheduling In-Store Trial Fitting Session...");
  const appointmentTime = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const appointment = await scheduleFittingAppointmentRepo(dummySellerId, {
    orderId: order.id,
    customerId: customer.userId,
    scheduledAt: appointmentTime,
    durationMinutes: 45,
    tailorMasterName: "Master Sartorialist Matteo",
    fittingNotes: "Initial basting trial for chest suppression and lapel drape.",
  });
  assert.ok(appointment.id);
  assert.strictEqual(appointment.status, "SCHEDULED");
  console.log(`✓ Fitting appointment booked: ${appointment.id}`);

  // Step 4: Verify fitting appointments query
  console.log("--> 4. Querying Atelier Fitting Schedule...");
  const appointmentsList = await getFittingAppointmentsRepo(dummySellerId, order.id);
  assert.ok(appointmentsList.length >= 1, "Fitting appointments retrieved successfully");
  const booked = appointmentsList.find((a) => a.id === appointment.id);
  assert.ok(booked);
  assert.strictEqual(booked.tailorMasterName, "Master Sartorialist Matteo");
  assert.strictEqual(booked.orderNumber, order.orderNumber);
  console.log("✓ Fitting schedule query verified with order details.");

  // Step 5: Master tailor conducts trial fitting session -> Alterations required
  console.log("--> 5. Master Tailor Records Fitting Verdict (Alterations Required)...");
  const updatedFitting = await updateFittingAppointmentRepo(dummySellerId, appointment.id, {
    status: "COMPLETED",
    fittingNotes: "Client requested snugger waist silhouette.",
    alterationsRequired: true,
    alterationDetails: "Take in waist suppression by 0.75 in; shorten sleeve pitch by 0.25 in.",
    advanceTailoringStage: true,
  });
  assert.strictEqual(updatedFitting.status, "COMPLETED");
  assert.strictEqual(updatedFitting.alterationsRequired, true);
  console.log("✓ Fitting session completed; alterations recorded.");

  // Step 6: Advance through final stages to READY_FOR_PICKUP
  console.log("--> 6. Finishing Garment & Advancing to READY_FOR_PICKUP...");
  await updateTailoringStageRepo(dummySellerId, order.id, {
    stage: "FINAL_STITCH",
    notes: "Alterations completed. Final pick-stitching and buttonholes hand-sewn.",
  });
  await updateTailoringStageRepo(dummySellerId, order.id, {
    stage: "QUALITY_INSPECTION",
    notes: "Steam pressed, dimensions re-measured against customer profile, passed QA.",
  });
  const readyOrder = await updateTailoringStageRepo(dummySellerId, order.id, {
    stage: "READY_FOR_PICKUP",
    notes: "Suit packed in breathable garment bag, ready for atelier collection.",
  });
  assert.strictEqual(readyOrder.tailoringStage, "READY_FOR_PICKUP");
  console.log("✓ Bespoke garment ready for customer pickup.");

  // Step 7: In-store handover and collection
  console.log("--> 7. Executing In-Store Garment Handover & Final Settlement...");
  const completedOrder = await recordInStoreHandoverRepo(dummySellerId, order.id, {
    handoverNotes: "Customer tried on finished suit in fitting suite. Fit confirmed impeccable. Handed over.",
    markPaid: true,
  });
  assert.strictEqual(completedOrder.status, "COMPLETED");
  assert.strictEqual(completedOrder.tailoringStage, "COMPLETED");
  assert.strictEqual(completedOrder.paymentStatus, "PAID");
  assert.ok(completedOrder.deliveredAt);
  console.log("✓ In-store handover completed; order finalized and paid.");

  // Step 8: Verify customer notifications feed
  console.log("--> 8. Verifying Customer In-App Notification Feed...");
  const notifs = await NotificationService.getBuyerNotifications(customer.userId);
  const hasFittingNotif = notifs.some((n) => n.title.includes("Trial Fitting Scheduled"));
  const hasHandoverNotif = notifs.some((n) => n.title.includes("Handover Completed"));
  assert.ok(hasFittingNotif, "Buyer received trial fitting appointment notification");
  assert.ok(hasHandoverNotif, "Buyer received garment handover completed notification");
  console.log("✓ Customer in-app notification feed verified across fitting and handover!");

  console.log("=== ALL PHASE 4 ATELIER FITTING & HANDOVER TESTS PASSED PERFECTLY ===");
  process.exit(0);
}

runPhase4TestSuite().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
