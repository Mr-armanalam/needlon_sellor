export async function validateCoupon({ code }: { code: string; userId: string }) {
  if (code.toUpperCase() === "SAVE10" || code.toUpperCase() === "WELCOME") {
    return {
      valid: true,
      coupon: {
        id: "c-1",
        code: code.toUpperCase(),
        type: "PERCENT",
        value: 10,
        usedCount: 0,
        maxUses: 1,
        expiresAt: new Date(Date.now() + 86400000 * 30),
      },
    };
  }

  return { valid: false, message: "Invalid or expired coupon" };
}

