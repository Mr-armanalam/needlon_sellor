import { PackingSlipData } from "../types";
import { generateBarcodeSVG, generateQrCodeSVG } from "../utils/barcode-qr";

export function generatePackingSlipHTML(data: PackingSlipData): string {
  const barcodeSvg = generateBarcodeSVG(data.orderNumber, { height: 40 });
  const qrSvg = generateQrCodeSVG(`PACKING:${data.orderNumber}|QTY:${data.totalQuantity}`, 75);

  const itemsRows = data.items.map((item, index) => `
    <tr>
      <td style="text-align: center; font-weight: 700;">[ &nbsp; ]</td>
      <td style="text-align: center;">${index + 1}</td>
      <td>
        <div style="font-weight: 700; color: #111827; font-size: 13px;">${item.productName}</div>
        ${item.variantName ? `<div style="font-size: 11px; color: #4b5563; font-weight: 600;">Variant: ${item.variantName}</div>` : ""}
      </td>
      <td style="font-family: monospace; font-weight: 700; color: #374151;">${item.sku || "N/A"}</td>
      <td style="text-align: center; font-size: 14px; font-weight: 800; color: #111827;">${item.quantity}</td>
      <td style="text-align: right; color: #4b5563;">${item.weightKg ? `${item.weightKg.toFixed(2)} kg` : "0.35 kg"}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Packing Slip - ${data.orderNumber}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { margin: 0; padding: 20px; color: #111827; background: #fff; font-size: 12px; line-height: 1.4; }
    .slip-card { max-width: 800px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 24px; border-radius: 8px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111827; padding-bottom: 14px; margin-bottom: 18px; }
    .title-box h1 { margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; }
    .title-box p { margin: 2px 0 0 0; color: #6b7280; font-size: 12px; font-weight: 600; }
    .meta-box { text-align: right; }
    .meta-box p { margin: 2px 0; font-size: 12px; }
    .shipping-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f9fafb; padding: 14px; border-radius: 6px; border: 1px solid #f3f4f6; margin-bottom: 20px; }
    .box h3 { margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #6b7280; font-weight: 700; letter-spacing: 0.5px; }
    .box p { margin: 2px 0; font-size: 12px; color: #1f2937; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
    th { background: #111827; color: #ffffff; text-transform: uppercase; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; padding: 8px; text-align: left; }
    td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
    .summary-bar { display: flex; justify-content: space-between; align-items: center; background: #f3f4f6; padding: 10px 14px; border-radius: 6px; font-weight: 700; font-size: 12px; }
    .notes-box { margin-top: 20px; border: 1px dashed #d1d5db; padding: 12px; border-radius: 6px; font-size: 11px; color: #4b5563; }
    .notes-box h4 { margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; color: #374151; }
    .footer { margin-top: 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e7eb; padding-top: 14px; }
    @media print {
      body { padding: 0; background: none; }
      .slip-card { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="slip-card">
    <div class="header">
      <div class="title-box">
        <h1>PACKING SLIP</h1>
        <p>Package Verification & Dispatch Checklist</p>
      </div>
      <div class="meta-box">
        <div>${barcodeSvg}</div>
        <p style="margin-top: 4px;">Order Date: <strong>${data.orderDate}</strong></p>
        <p>Method: <strong>${data.shippingMethod || "STANDARD"}</strong></p>
      </div>
    </div>

    <div class="shipping-grid">
      <div class="box">
        <h3>Ship From (Boutique Store)</h3>
        <p><strong>${data.seller.storeName}</strong></p>
        <p>${data.seller.address.addressLine1}</p>
        ${data.seller.address.addressLine2 ? `<p>${data.seller.address.addressLine2}</p>` : ""}
        <p>${data.seller.address.city}, ${data.seller.address.state} - ${data.seller.address.postalCode}</p>
        <p>Phone: ${data.seller.phone || "+91 9876543210"}</p>
      </div>
      <div class="box">
        <h3>Ship To (Customer)</h3>
        <p><strong>${data.buyer.name}</strong></p>
        <p>${data.buyer.shippingAddress.addressLine1}</p>
        ${data.buyer.shippingAddress.addressLine2 ? `<p>${data.buyer.shippingAddress.addressLine2}</p>` : ""}
        <p>${data.buyer.shippingAddress.city}, ${data.buyer.shippingAddress.state} - ${data.buyer.shippingAddress.postalCode}</p>
        <p>Contact: <strong>${data.buyer.phone}</strong></p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 6%; text-align: center;">Checked</th>
          <th style="width: 4%; text-align: center;">#</th>
          <th style="width: 46%;">Product Name & Variant</th>
          <th style="width: 20%;">SKU Code</th>
          <th style="width: 10%; text-align: center;">Qty</th>
          <th style="width: 14%; text-align: right;">Est. Weight</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="summary-bar">
      <span>Total Units to Pack: <strong>${data.totalQuantity} Items</strong></span>
      <span>Total Est. Package Weight: <strong>${data.totalWeightKg ? data.totalWeightKg.toFixed(2) : "0.50"} kg</strong></span>
    </div>

    <div class="notes-box">
      <h4>Fulfillment Admin & Packaging Remarks</h4>
      <p style="margin: 0;">${data.packingNotes || "Handle with care. Inspect quality seal before dispatching package."}</p>
    </div>

    <div class="footer">
      <div style="display: flex; align-items: center; gap: 10px;">
        ${qrSvg}
        <span style="font-size: 10px; color: #6b7280;">Scan to verify packing list checksum</span>
      </div>
      <div style="text-align: right; font-size: 11px; color: #6b7280;">
        <p style="margin: 0;">Packed by: ________________________</p>
        <p style="margin: 4px 0 0 0;">Quality Verified: [ &nbsp; ] PASS</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
