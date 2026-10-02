import assert from "node:assert";
import {
  markNotificationReadSchema,
  updateNotificationPreferencesSchema,
} from "../modules/shared/dto/notification.dto";

function testNotificationValidations() {
  console.log("--> Testing Notifications & Settings Zod Validations...");

  // Valid Mark Single Read DTO
  const singleRead = {
    notificationId: "123e4567-e89b-12d3-a456-426614174000",
    markAll: false,
  };
  const parsedSingle = markNotificationReadSchema.parse(singleRead);
  assert.strictEqual(parsedSingle.notificationId, "123e4567-e89b-12d3-a456-426614174000");

  // Valid Mark All Read DTO
  const markAllRead = { markAll: true };
  const parsedMarkAll = markNotificationReadSchema.parse(markAllRead);
  assert.strictEqual(parsedMarkAll.markAll, true);

  // Invalid UUID assertion
  assert.throws(() => {
    markNotificationReadSchema.parse({ notificationId: "invalid-uuid" });
  });

  // Valid Notification Preferences Update DTO
  const validPrefs = {
    emailEnabled: true,
    pushEnabled: false,
    orderEnabled: true,
    messageEnabled: true,
  };
  const parsedPrefs = updateNotificationPreferencesSchema.parse(validPrefs);
  assert.strictEqual(parsedPrefs.emailEnabled, true);
  assert.strictEqual(parsedPrefs.pushEnabled, false);

  console.log("✓ Notification Zod validation tests passed.");
}

function testUnreadNotificationCounters() {
  console.log("--> Testing Notification Counter State Calculations...");

  const mockNotifications = [
    { id: "1", title: "New Order", isRead: false },
    { id: "2", title: "New Message", isRead: false },
    { id: "3", title: "Welcome System", isRead: true },
  ];

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
  assert.strictEqual(unreadCount, 2);

  // Simulate mark single notification read
  const updatedSingle = mockNotifications.map((n) =>
    n.id === "1" ? { ...n, isRead: true } : n
  );
  const updatedSingleUnread = updatedSingle.filter((n) => !n.isRead).length;
  assert.strictEqual(updatedSingleUnread, 1);

  // Simulate mark all notifications read
  const updatedAll = mockNotifications.map((n) => ({ ...n, isRead: true }));
  const updatedAllUnread = updatedAll.filter((n) => !n.isRead).length;
  assert.strictEqual(updatedAllUnread, 0);

  console.log("✓ Unread notification counter tests passed.");
}

function runAllTests() {
  console.log("=== REALTIME & NOTIFICATIONS MODULE TEST SUITE ===");
  testNotificationValidations();
  testUnreadNotificationCounters();
  console.log("=== ALL REALTIME & NOTIFICATIONS UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
