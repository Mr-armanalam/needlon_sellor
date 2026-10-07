export const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

/**
 * Extracts the 10-character PAN from a standard 15-character Indian GSTIN.
 * In a GSTIN (e.g. 27AAAAA0000A1Z5), characters at index 2 to 12 represent the PAN.
 */
export function extractPanFromGst(gstin: string): string | null {
  const cleanedGst = gstin.trim().toUpperCase();
  if (cleanedGst.length !== 15 || !GSTIN_REGEX.test(cleanedGst)) {
    return null;
  }
  return cleanedGst.substring(2, 12);
}

/**
 * Validates whether a provided PAN matches the PAN embedded within a GSTIN.
 */
export function doesPanMatchGst(pan: string, gstin: string): boolean {
  const extractedPan = extractPanFromGst(gstin);
  if (!extractedPan) {
    return false;
  }
  return extractedPan.toUpperCase() === pan.trim().toUpperCase();
}
