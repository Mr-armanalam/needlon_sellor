import { ShippingLabelData } from "../types";
import { generateBarcodeSVG, generateQrCodeSVG } from "../utils/barcode-qr";

export function generateShippingLabelHTML(data: ShippingLabelData): string {
  const barcodeSvg = generateBarcodeSVG(data.trackingNumber || data.orderNumber, { height: 50, widthRatio: 2 });
  const qrSvg = generateQrCodeSVG(`LABEL:${data.trackingNumber}|ORDER:${data.orderNumber}|COURIER:${data.courierName}`, 90);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shipping Label - ${data.orderNumber}</title>
  <style>
    @page { size: 100mm 150mm; margin: 0; }
    * { box-sizing: border-box; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { margin: 0; padding: 12px; background: #fff; color: #000; width: 4in; min-height: 6in; }
    .label-card { border: 2px solid #000; padding: 10px; height: 100%; display: flex; flex-col; flex-direction: column; justify-content: space-between; }
    .courier-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
    .courier-name { font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; }
    .cod-badge { font-size: 14px; font-weight: 900; border: 2px solid #000; padding: 4px 8px; background: #000; color: #fff; text-transform: uppercase; border-radius: 4px; }
    .prepaid-badge { font-size: 14px; font-weight: 900; border: 2px solid #000; padding: 4px 8px; background: #fff; color: #000; text-transform: uppercase; border-radius: 4px; }
    .barcode-section { text-align: center; border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
    .address-section { display: flex; gap: 8px; border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 8px; }
    .to-address { flex: 1; font-size: 12px; line-height: 1.3; }
    .to-address h3 { margin: 0 0 2px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .to-address .name { font-size: 14px; font-weight: 800; }
    .to-address .phone { font-size: 13px; font-weight: 800; margin-top: 4px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 8px; font-size: 11px; }
    .from-address { font-size: 10px; color: #333; }
    .from-address h4 { margin: 0 0 2px 0; font-size: 9px; text-transform: uppercase; }
    .summary-text { font-size: 10px; font-weight: 600; color: #222; }
    @media print {
      body { padding: 0; }
      .label-card { border: 2px solid #000; }
    }
  </style>
</head>
<body>
  <div class="label-card">
    <!-- Courier Header -->
    <div class="courier-header">
      <div>
        <div class="courier-name">${data.courierName || "EXPRESS LOGISTICS"}</div>
        <div style="font-size: 10px; font-weight: 700;">TRACKING: ${data.trackingNumber}</div>
      </div>
      <div>
        ${data.isCod ? `<div class="cod-badge">COD: ${formatCurrency(data.codAmount)}</div>` : `<div class="prepaid-badge">PREPAID</div>`}
      </div>
    </div>

    <!-- Barcode Section -->
    <div class="barcode-section">
      ${barcodeSvg}
    </div>

    <!-- To Destination -->
    <div class="address-section">
      <div class="to-address">
        <h3>DELIVER TO:</h3>
        <div class="name">${data.buyer.name}</div>
        <div>${data.buyer.shippingAddress.addressLine1}</div>
        ${data.buyer.shippingAddress.addressLine2 ? `<div>${data.buyer.shippingAddress.addressLine2}</div>` : ""}
        <div><strong>${data.buyer.shippingAddress.city.toUpperCase()}, ${data.buyer.shippingAddress.state.toUpperCase()} - ${data.buyer.shippingAddress.postalCode}</strong></div>
        <div class="phone">TEL: ${data.buyer.phone}</div>
      </div>
      <div>
        ${qrSvg}
      </div>
    </div>

    <!-- Meta Details -->
    <div class="meta-grid">
      <div>
        <div>Order #: <strong>${data.orderNumber}</strong></div>
        <div>Order Date: <strong>${data.date}</strong></div>
      </div>
      <div>
        <div>Est. Weight: <strong>${data.weightKg ? data.weightKg.toFixed(2) : "0.50"} kg</strong></div>
        <div>Routing: <strong>${data.buyer.shippingAddress.city.substring(0, 3).toUpperCase()}/STD</strong></div>
      </div>
    </div>

    <!-- From Sender & Summary -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
      <div class="from-address">
        <h4>RETURN IF UNDELIVERED TO (SENDER):</h4>
        <div><strong>${data.seller.storeName}</strong></div>
        <div>${data.seller.address.addressLine1}, ${data.seller.address.city} - ${data.seller.address.postalCode}</div>
        <div>Phone: ${data.seller.phone || "+91 9876543210"}</div>
      </div>
      <div style="text-align: right;" class="summary-text">
        Needlon Marketplace Partner
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
