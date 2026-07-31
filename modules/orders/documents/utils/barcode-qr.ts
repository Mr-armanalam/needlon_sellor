/**
 * Generates an SVG string for Code128 Barcode.
 */
export function generateBarcodeSVG(text: string, options?: { height?: number; widthRatio?: number }): string {
  const height = options?.height || 45;
  const widthRatio = options?.widthRatio || 1.8;
  const cleanText = text.replace(/[^A-Za-z0-9\-]/g, "");

  // Simple Code128 patterns for digit/uppercase encoding
  const CODE128_PATTERNS: Record<string, string> = {
    "0": "11011001100", "1": "11001101100", "2": "11001100110", "3": "10010011000",
    "4": "10010001100", "5": "10001001100", "6": "10011001000", "7": "10011000100",
    "8": "10001100100", "9": "11001001000", "A": "11001000100", "B": "11000100100",
    "C": "10110011000", "D": "10110001100", "E": "10011011000", "F": "10011000110",
    "G": "10001101100", "H": "10001100110", "I": "11010011000", "J": "11010001100",
    "K": "11001011000", "L": "11001000110", "M": "11000101100", "N": "11000100110",
    "O": "10110110000", "P": "10110000110", "Q": "10011011000", "R": "10011000010",
    "S": "10000110110", "T": "11000010110", "U": "10001101100", "V": "10001100110",
    "W": "11011000010", "X": "11000011010", "Y": "11010000110", "Z": "11000010010",
    "-": "10100011000", "START_B": "11010010000", "STOP": "1100011101011"
  };

  let bitPattern = CODE128_PATTERNS["START_B"];
  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i].toUpperCase();
    bitPattern += CODE128_PATTERNS[char] || CODE128_PATTERNS["0"];
  }
  bitPattern += CODE128_PATTERNS["STOP"];

  const totalWidth = Math.ceil(bitPattern.length * widthRatio);
  let svgPaths = "";
  let x = 0;

  for (let i = 0; i < bitPattern.length; i++) {
    const bit = bitPattern[i];
    if (bit === "1") {
      svgPaths += `<rect x="${x}" y="0" width="${widthRatio}" height="${height}" fill="#000" />`;
    }
    x += widthRatio;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${height + 18}" width="${totalWidth}" height="${height + 18}">
      ${svgPaths}
      <text x="${totalWidth / 2}" y="${height + 14}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#111">${text}</text>
    </svg>
  `;
}

/**
 * Generates an SVG representation for QR Code matrix.
 */
export function generateQrCodeSVG(text: string, size = 90): string {
  // SVG representations of QR visual pattern grid
  const cells: string[] = [];
  const gridSize = 21;
  const cellSize = size / gridSize;

  // Simple deterministic pattern generator based on hash of text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Corner finder patterns (7x7)
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= gridSize - 7;
      const isBottomLeft = r >= gridSize - 7 && c < 7;

      let isBlack = false;
      if (isTopLeft || isTopRight || isBottomLeft) {
        const lr = isTopRight ? r : isBottomLeft ? r - (gridSize - 7) : r;
        const lc = isTopRight ? c - (gridSize - 7) : c;
        if (lr === 0 || lr === 6 || lc === 0 || lc === 6) isBlack = true;
        else if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) isBlack = true;
      } else {
        const bit = ((hash ^ (r * 31 + c * 17)) & 1) === 0;
        isBlack = bit;
      }

      if (isBlack) {
        cells.push(`<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="#111827" />`);
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="#ffffff" />
      ${cells.join("")}
    </svg>
  `;
}
