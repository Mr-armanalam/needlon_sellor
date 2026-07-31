import "dotenv/config";
import { parseUserAgent, formatRelativeTime, formatDateString } from "./lib/logout-service";

async function runLogoutServiceTests() {
  console.log("🚀 Running Logout Service Unit Tests...");

  // 1. Test parseUserAgent with macOS / Chrome
  const macChrome = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
  const parsedMac = parseUserAgent(macChrome);
  console.log("Test 1 - macOS Chrome:", parsedMac);
  if (parsedMac.os !== "macOS" || parsedMac.browser !== "Google Chrome") {
    throw new Error("Failed macOS Chrome user-agent parsing test");
  }

  // 2. Test parseUserAgent with iPhone / Safari
  const iphoneSafari = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
  const parsedIphone = parseUserAgent(iphoneSafari);
  console.log("Test 2 - iPhone Safari:", parsedIphone);
  if (!parsedIphone.os.startsWith("iOS") || parsedIphone.browser !== "Mobile Safari") {
    throw new Error("Failed iPhone Safari user-agent parsing test");
  }

  // 3. Test parseUserAgent with null / undefined
  const parsedNull = parseUserAgent(null);
  console.log("Test 3 - Null User Agent:", parsedNull);
  if (parsedNull.deviceName !== "Unknown Device") {
    throw new Error("Failed null user-agent parsing test");
  }

  // 4. Test formatRelativeTime
  const justNow = formatRelativeTime(new Date());
  console.log("Test 4 - Relative time just now:", justNow);
  if (justNow !== "Just now") {
    throw new Error("Failed relative time test");
  }

  // 5. Test formatDateString
  const dateFormatted = formatDateString(new Date("2026-06-25T00:00:00Z"));
  console.log("Test 5 - Date formatting:", dateFormatted);
  if (!dateFormatted.includes("June 25, 2026") && !dateFormatted.includes("2026")) {
    throw new Error("Failed date formatting test");
  }

  console.log("✅ All Logout Service Unit Tests Passed Successfully!");
}

runLogoutServiceTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Logout Service Unit Tests Failed:", err);
    process.exit(1);
  });
