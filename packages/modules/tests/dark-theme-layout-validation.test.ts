import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

/**
 * Validates that classes adhere to Layout Invariance rules
 * (i.e. no layout shifts between light and dark themes).
 */
export function verifyBorderInvariance(classString: string): boolean {
  const tokens = classString.split(/\s+/).filter(Boolean);
  const hasDarkBorder = tokens.some((t) => t.startsWith("dark:border") && !t.includes("dark:border-stone") && !t.includes("dark:border-white") && !t.includes("dark:border-black") && !t.includes("dark:border-transparent"));
  const hasBaseBorder = tokens.some((t) => t === "border" || t === "border-t" || t === "border-b" || t === "border-l" || t === "border-r" || t === "border-y" || t === "border-x");

  // If a component activates a border exclusively in dark mode without base border/border-transparent, it shifts layout by 1-2px.
  if (hasDarkBorder && !hasBaseBorder) {
    return false;
  }
  return true;
}

/**
 * Validates that typography weights/sizes do not conditionally shift in dark mode
 */
export function verifyFontMetricInvariance(classString: string): boolean {
  const tokens = classString.split(/\s+/).filter(Boolean);
  const darkFontAlters = tokens.filter((t) => t.startsWith("dark:text-") && (t.includes("sm") || t.includes("md") || t.includes("lg") || t.includes("xl") || t.includes("2xl")));
  // Font sizes should not conditionally switch between light and dark
  return darkFontAlters.length === 0;
}

/**
 * Measures layout geometry deltas
 */
export function computeLayoutShiftDelta(
  lightRect: { x: number; y: number; width: number; height: number },
  darkRect: { x: number; y: number; width: number; height: number }
) {
  return {
    deltaX: Math.abs(lightRect.x - darkRect.x),
    deltaY: Math.abs(lightRect.y - darkRect.y),
    deltaWidth: Math.abs(lightRect.width - darkRect.width),
    deltaHeight: Math.abs(lightRect.height - darkRect.height),
    isInvariant:
      lightRect.x === darkRect.x &&
      lightRect.y === darkRect.y &&
      lightRect.width === darkRect.width &&
      lightRect.height === darkRect.height,
  };
}

async function runDarkThemeLayoutValidationTests() {
  console.log("--> Running Dark Theme & Layout Invariance Validation Tests...");

  // 1. Validate globals.css tokens
  const globalsCssPath = path.resolve(process.cwd(), "apps/client/app/globals.css");
  assert.ok(fs.existsSync(globalsCssPath), "globals.css must exist");

  const globalsCssContent = fs.readFileSync(globalsCssPath, "utf-8");

  // Validate light mode tokens (:root)
  assert.ok(globalsCssContent.includes(":root {"), ":root definition must exist");
  assert.ok(globalsCssContent.includes("--background: oklch(1 0 0);"), "Light background must remain oklch(1 0 0)");
  assert.ok(globalsCssContent.includes("--foreground: oklch(0.145 0 0);"), "Light foreground must remain oklch(0.145 0 0)");

  // Validate dark mode tokens (.dark)
  assert.ok(globalsCssContent.includes(".dark {"), ".dark definition must exist");
  assert.ok(globalsCssContent.includes("--background: oklch(0.145 0 0);"), "Dark background must be defined");
  assert.ok(globalsCssContent.includes("--foreground: oklch(0.985 0 0);"), "Dark foreground must be defined");
  assert.ok(globalsCssContent.includes("--card: oklch(0.205 0 0);"), "Dark card background must be defined");
  assert.ok(globalsCssContent.includes("--border: oklch(1 0 0 / 10%);"), "Dark border token must be defined");

  // 2. Validate Layout Invariance Logic
  assert.strictEqual(
    verifyBorderInvariance("border border-stone-200 dark:border-stone-800"),
    true,
    "Invariant border colors must pass"
  );
  assert.strictEqual(
    verifyBorderInvariance("border border-transparent dark:border-stone-800"),
    true,
    "Transparent border to dark border must pass without layout shift"
  );
  assert.strictEqual(
    verifyBorderInvariance("dark:border p-4"),
    false,
    "Adding dark:border without base border must fail (causes 1px layout shift)"
  );

  // 3. Validate Font Metric Invariance
  assert.strictEqual(
    verifyFontMetricInvariance("font-semibold text-gray-900 dark:text-stone-100"),
    true,
    "Text color changes without font resizing must pass"
  );
  assert.strictEqual(
    verifyFontMetricInvariance("text-sm dark:text-lg"),
    false,
    "Changing font size conditionally in dark mode must fail (causes reflow)"
  );

  // 4. Validate Delta Measurements
  const cardLight = { x: 100, y: 250, width: 320, height: 480 };
  const cardDark = { x: 100, y: 250, width: 320, height: 480 };
  const delta = computeLayoutShiftDelta(cardLight, cardDark);

  assert.strictEqual(delta.isInvariant, true, "Layout should be completely invariant");
  assert.strictEqual(delta.deltaWidth, 0, "Width delta must be 0px");
  assert.strictEqual(delta.deltaHeight, 0, "Height delta must be 0px");

  console.log("✓ All Dark Theme & Layout Invariance Validation tests passed successfully!");
}

runDarkThemeLayoutValidationTests().catch((err) => {
  console.error("❌ Test execution failed:", err);
  process.exit(1);
});
