/**
 * Generates a random coupon code.
 * 
 * @param length - Total length of the coupon (default: 8)
 * @param prefix - Optional prefix like "WELCOME" or "NEW"
 * @returns Example: "WELCOME-AB12CD34"
 */
export function generateCouponCode(length = 8, prefix?: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return prefix ? `${prefix}-${code}` : code;
}