import { InvoiceData } from "../types";
import { generateBarcodeSVG, generateQrCodeSVG } from "../utils/barcode-qr";

export function generateInvoiceHTML(data: InvoiceData): string {
  const barcodeSvg = generateBarcodeSVG(data.invoiceNumber || data.orderNumber, { height: 40 });
  const qrSvg = generateQrCodeSVG(`INVOICE:${data.invoiceNumber}|ORDER:${data.orderNumber}|TOTAL:${data.grandTotal}`, 85);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const itemsRows = data.items.map((item, index) => {
    const taxRate = item.taxRate || 0.18;
    const taxableVal = item.total / (1 + taxRate);
    const taxAmount = item.total - taxableVal;
    const cgst = taxAmount / 2;
    const sgst = taxAmount / 2;

    return `
      <tr>
        <td style="text-align: center;">${index + 1}</td>
        <td>
          <div style="font-weight: 700; color: #111827;">${item.productName}</div>
          ${item.variantName ? `<div style="font-size: 11px; color: #6b7280;">Variant: ${item.variantName}</div>` : ""}
          ${item.sku ? `<div style="font-size: 10px; color: #9ca3af;">SKU: ${item.sku}</div>` : ""}
        </td>
        <td style="text-align: center;">${item.hsnCode || "6204"}</td>
        <td style="text-align: center; font-weight: 600;">${item.quantity}</td>
        <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
        <td style="text-align: right;">${formatCurrency(taxableVal)}</td>
        <td style="text-align: right;">${formatCurrency(cgst)} (9%)</td>
        <td style="text-align: right;">${formatCurrency(sgst)} (9%)</td>
        <td style="text-align: right; font-weight: 700;">${formatCurrency(item.total)}</td>
      </tr>
    `;
  }).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${data.invoiceNumber}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { margin: 0; padding: 20px; color: #111827; background: #fff; font-size: 12px; line-height: 1.4; }
    .invoice-card { max-width: 800px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 24px; border-radius: 8px; position: relative; }
    .watermark { position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 44px; font-weight: 800; color: rgba(0,0,0,0.03); text-transform: uppercase; pointer-events: none; white-space: nowrap; }
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111827; padding-bottom: 16px; margin-bottom: 20px; }
    .logo-title h1 { margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; }
    .logo-title p { margin: 2px 0 0 0; color: #6b7280; font-size: 11px; font-weight: 600; }
    .inv-details { text-align: right; }
    .inv-details h2 { margin: 0; font-size: 18px; font-weight: 800; color: #111827; letter-spacing: 0.5px; }
    .inv-details p { margin: 2px 0; font-size: 12px; color: #4b5563; }
    .addresses-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; background: #f9fafb; padding: 14px; border-radius: 6px; border: 1px solid #f3f4f6; }
    .addr-box h3 { margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 700; }
    .addr-box p { margin: 2px 0; font-size: 12px; color: #1f2937; }
    .table-container { width: 100%; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { background: #111827; color: #ffffff; text-transform: uppercase; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; padding: 8px 10px; text-align: left; }
    td { padding: 9px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    .financials-section { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 16px; }
    .qr-container { display: flex; align-items: center; gap: 14px; background: #f9fafb; padding: 10px 14px; border-radius: 6px; border: 1px solid #e5e7eb; }
    .totals-table { width: 280px; }
    .totals-table table { width: 100%; }
    .totals-table td { padding: 5px 8px; border: none; }
    .totals-table tr.grand-total td { font-size: 14px; font-weight: 800; border-top: 2px solid #111827; border-bottom: 2px solid #111827; padding: 8px; }
    .footer-section { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 14px; display: flex; justify-content: space-between; align-items: flex-end; }
    .terms { max-width: 450px; font-size: 10px; color: #6b7280; line-height: 1.5; }
    .terms h4 { margin: 0 0 4px 0; font-size: 10px; color: #374151; text-transform: uppercase; }
    .signature { text-align: right; min-width: 180px; }
    .signature-line { margin-top: 40px; border-top: 1px dashed #9ca3af; padding-top: 4px; font-weight: 700; font-size: 11px; color: #374151; }
    @media print {
      body { padding: 0; background: none; }
      .invoice-card { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="watermark">ORIGINAL TAX INVOICE</div>

    <!-- Header -->
    <div class="header-row">
      <div class="logo-title">
        <h1>${data.seller.storeName || "Needlon Boutique"}</h1>
        <p>${data.seller.legalName || "Registered Seller Partner"}</p>
        <p style="margin-top: 4px;">GSTIN: <strong>${data.seller.gstin || "27AAAAA0000A1Z5"}</strong></p>
      </div>
      <div class="inv-details">
        <h2>TAX INVOICE</h2>
        <p>Invoice No: <strong>${data.invoiceNumber}</strong></p>
        <p>Invoice Date: <strong>${data.invoiceDate}</strong></p>
        <p>Order ID: <strong>${data.orderNumber}</strong> (${data.orderDate})</p>
      </div>
    </div>

    <!-- Addresses & Info -->
    <div class="addresses-grid">
      <div class="addr-box">
        <h3>Billed From (Seller)</h3>
        <p><strong>${data.seller.storeName}</strong></p>
        <p>${data.seller.address.addressLine1}</p>
        ${data.seller.address.addressLine2 ? `<p>${data.seller.address.addressLine2}</p>` : ""}
        <p>${data.seller.address.city}, ${data.seller.address.state} - ${data.seller.address.postalCode}</p>
        <p>Email: ${data.seller.email || "seller@needlon.com"} | Phone: ${data.seller.phone || "+91 9876543210"}</p>
      </div>
      <div class="addr-box">
        <h3>Billed To (Buyer)</h3>
        <p><strong>${data.buyer.name}</strong></p>
        <p>${data.buyer.shippingAddress.addressLine1}</p>
        ${data.buyer.shippingAddress.addressLine2 ? `<p>${data.buyer.shippingAddress.addressLine2}</p>` : ""}
        <p>${data.buyer.shippingAddress.city}, ${data.buyer.shippingAddress.state} - ${data.buyer.shippingAddress.postalCode}</p>
        <p>Phone: ${data.buyer.phone} | Email: ${data.buyer.email}</p>
        <p style="margin-top: 4px;">Payment: <strong>${data.paymentMethod}</strong> (${data.paymentStatus})</p>
      </div>
    </div>

    <!-- Items Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 4%;">#</th>
            <th style="width: 28%;">Item & Description</th>
            <th style="width: 8%; text-align: center;">HSN</th>
            <th style="width: 6%; text-align: center;">Qty</th>
            <th style="width: 12%; text-align: right;">Unit Price</th>
            <th style="width: 12%; text-align: right;">Taxable</th>
            <th style="width: 10%; text-align: right;">CGST</th>
            <th style="width: 10%; text-align: right;">SGST</th>
            <th style="width: 14%; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>

    <!-- Financials & QR Code -->
    <div class="financials-section">
      <div class="qr-container">
        <div>${qrSvg}</div>
        <div>
          <p style="margin: 0; font-weight: 700; font-size: 11px;">Verify Invoice Authenticity</p>
          <p style="margin: 2px 0 0 0; font-size: 10px; color: #6b7280;">Scan to inspect digital signature & GST breakdown.</p>
          <div style="margin-top: 6px;">${barcodeSvg}</div>
        </div>
      </div>

      <div class="totals-table">
        <table>
          <tr>
            <td style="color: #6b7280;">Item Subtotal:</td>
            <td style="text-align: right; font-weight: 600;">${formatCurrency(data.subtotal)}</td>
          </tr>
          ${data.discountTotal > 0 ? `
          <tr>
            <td style="color: #059669;">Discount:</td>
            <td style="text-align: right; font-weight: 600; color: #059669;">-${formatCurrency(data.discountTotal)}</td>
          </tr>` : ""}
          <tr>
            <td style="color: #6b7280;">Shipping Charge:</td>
            <td style="text-align: right; font-weight: 600;">${data.shippingCharge === 0 ? "FREE" : formatCurrency(data.shippingCharge)}</td>
          </tr>
          <tr>
            <td style="color: #6b7280;">Total Tax (GST 18%):</td>
            <td style="text-align: right; font-weight: 600;">${formatCurrency(data.taxTotal)}</td>
          </tr>
          <tr class="grand-total">
            <td>Grand Total:</td>
            <td style="text-align: right; color: #111827;">${formatCurrency(data.grandTotal)}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-section">
      <div class="terms">
        <h4>Terms & Conditions</h4>
        <ol style="margin: 0; padding-left: 14px;">
          <li>All goods remain property of seller until paid in full.</li>
          <li>Returns & exchanges are subject to Needlon Boutique return policy within 7 days.</li>
          <li>This is a computer-generated tax invoice requiring no physical signature.</li>
        </ol>
      </div>
      <div class="signature">
        <p style="font-size: 11px; font-weight: 700; margin: 0; color: #111827;">For ${data.seller.storeName}</p>
        <div class="signature-line">Authorized Signatory</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
