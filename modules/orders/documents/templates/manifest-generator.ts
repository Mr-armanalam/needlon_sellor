import { ManifestData } from "../types";
import { generateBarcodeSVG, generateQrCodeSVG } from "../utils/barcode-qr";

export function generateManifestHTML(data: ManifestData): string {
  const barcodeSvg = generateBarcodeSVG(data.manifestNumber, { height: 45 });
  const qrSvg = generateQrCodeSVG(`MANIFEST:${data.manifestNumber}|ORDERS:${data.totalOrders}|COURIER:${data.courierName}`, 80);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);
  };

  const rows = data.orders.map((item, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td>
        <div style="font-weight: 700; color: #111827;">${item.orderNumber}</div>
        <div style="font-size: 10px; color: #6b7280;">AWB: ${item.trackingNumber}</div>
      </td>
      <td>
        <div style="font-weight: 600;">${item.buyerName}</div>
        <div style="font-size: 10px; color: #4b5563;">Ph: ${item.buyerPhone}</div>
      </td>
      <td>${item.cityState}</td>
      <td style="text-align: center; font-weight: 600;">${item.itemsCount}</td>
      <td style="text-align: center; color: #4b5563;">${item.weightKg ? item.weightKg.toFixed(2) : "0.50"} kg</td>
      <td style="text-align: center;">
        ${item.isCod ? `<span style="font-weight: 700; color: #b91c1c;">COD (${formatCurrency(item.codAmount)})</span>` : `<span style="font-weight: 600; color: #047857;">PREPAID</span>`}
      </td>
      <td style="text-align: center; font-weight: 700;">[ &nbsp; ] PASS</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shipment Manifest - ${data.manifestNumber}</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { margin: 0; padding: 18px; color: #111827; background: #fff; font-size: 11px; line-height: 1.4; }
    .manifest-card { max-width: 1000px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111827; padding-bottom: 12px; margin-bottom: 16px; }
    .title-area h1 { margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; }
    .title-area p { margin: 2px 0 0 0; color: #4b5563; font-size: 12px; font-weight: 600; }
    .meta-area { text-align: right; }
    .seller-bar { display: flex; justify-content: space-between; background: #f9fafb; padding: 10px 14px; border-radius: 6px; border: 1px solid #f3f4f6; margin-bottom: 16px; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
    th { background: #111827; color: #ffffff; text-transform: uppercase; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; padding: 8px 6px; text-align: left; }
    td { padding: 8px 6px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
    .summary-box { display: flex; justify-content: space-between; align-items: center; background: #f3f4f6; padding: 10px 14px; border-radius: 6px; font-weight: 700; margin-bottom: 20px; }
    .signatures-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 10px; }
    .sig-box p { margin: 2px 0; color: #6b7280; font-size: 10px; }
    .sig-line { margin-top: 36px; border-top: 1px dashed #9ca3af; padding-top: 4px; font-weight: 700; font-size: 11px; color: #111827; }
    @media print {
      body { padding: 0; background: none; }
      .manifest-card { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="manifest-card">
    <div class="header">
      <div class="title-area">
        <h1>COURIER SHIPMENT MANIFEST</h1>
        <p>Logistics Carrier Package Handover Document</p>
      </div>
      <div class="meta-area">
        <div>${barcodeSvg}</div>
        <p style="margin-top: 4px; font-size: 12px;">Manifest ID: <strong>${data.manifestNumber}</strong></p>
      </div>
    </div>

    <div class="seller-bar">
      <div>
        <span style="color: #6b7280;">Boutique Store:</span> <strong>${data.seller.storeName}</strong> |
        <span style="color: #6b7280;">Phone:</span> ${data.seller.phone || "+91 9876543210"}
      </div>
      <div>
        <span style="color: #6b7280;">Logistics Carrier:</span> <strong style="text-transform: uppercase;">${data.courierName}</strong> |
        <span style="color: #6b7280;">Pickup Date:</span> <strong>${data.pickupDate}</strong>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 4%; text-align: center;">#</th>
          <th style="width: 18%;">Order & AWB</th>
          <th style="width: 20%;">Customer Contact</th>
          <th style="width: 18%;">Destination City</th>
          <th style="width: 8%; text-align: center;">Items</th>
          <th style="width: 10%; text-align: center;">Weight</th>
          <th style="width: 12%; text-align: center;">Payment Mode</th>
          <th style="width: 10%; text-align: center;">Carrier Check</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="summary-box">
      <span>Total Handover Packages: <strong>${data.totalOrders} Orders</strong></span>
      <span>Total Est. Manifest Weight: <strong>${data.totalWeightKg ? data.totalWeightKg.toFixed(2) : "0.00"} kg</strong></span>
      <span>Total Pending COD Cash Collect: <strong>${formatCurrency(data.totalCodAmount)}</strong></span>
    </div>

    <div class="signatures-grid">
      <div class="sig-box">
        <p>Handed over by (Seller):</p>
        <div class="sig-line">Store Executive Signature</div>
      </div>
      <div class="sig-box">
        <p>Received by (Courier Agent):</p>
        <div class="sig-line">Courier Driver / Agent Signature</div>
      </div>
      <div class="sig-box" style="display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
        ${qrSvg}
        <span style="font-size: 10px; color: #6b7280;">Official Needlon Logistics Manifest</span>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
