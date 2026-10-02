import assert from "node:assert";
import { generateBarcodeSVG, generateQrCodeSVG } from "../modules/orders/documents/utils/barcode-qr";
import { generateInvoiceHTML } from "../modules/orders/documents/templates/invoice-generator";
import { generatePackingSlipHTML } from "../modules/orders/documents/templates/packing-slip-generator";
import { generateShippingLabelHTML } from "../modules/orders/documents/templates/shipping-label-generator";
import { generateManifestHTML } from "../modules/orders/documents/templates/manifest-generator";
import { InvoiceData, PackingSlipData, ShippingLabelData, ManifestData } from "../modules/orders/documents/types";

function testBarcodeAndQrGenerators() {
  console.log("--> Testing Barcode & QR Code SVG generators...");
  const barcodeSvg = generateBarcodeSVG("NDL-10932");
  assert.ok(barcodeSvg.includes("<svg"), "Barcode SVG should contain <svg tag");
  assert.ok(barcodeSvg.includes("NDL-10932"), "Barcode SVG should render text string");

  const qrSvg = generateQrCodeSVG("INVOICE:INV-2026-000001");
  assert.ok(qrSvg.includes("<svg"), "QR SVG should contain <svg tag");
  assert.ok(qrSvg.includes("<rect"), "QR SVG should contain matrix rect elements");
  console.log("✓ Barcode & QR SVG tests passed.");
}

function testInvoiceTemplate() {
  console.log("--> Testing Tax Invoice HTML Generator...");
  const sampleInvoice: InvoiceData = {
    invoiceNumber: "INV-2026-000001",
    invoiceDate: "31/07/2026",
    orderNumber: "NDL-10932",
    orderDate: "30/07/2026",
    paymentMethod: "COD",
    paymentStatus: "PAID",
    seller: {
      storeName: "Handloom Craft House",
      legalName: "Handloom Craft House Pvt Ltd",
      gstin: "27AAAAA0000A1Z5",
      email: "seller@needlon.com",
      phone: "+91 9876543210",
      address: {
        recipientName: "Handloom Craft House",
        addressLine1: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
      },
    },
    buyer: {
      name: "Amit Sharma",
      email: "amit@example.com",
      phone: "+919876543211",
      shippingAddress: {
        recipientName: "Amit Sharma",
        addressLine1: "Flat 402, Lotus Residency",
        city: "Pune",
        state: "Maharashtra",
        postalCode: "411014",
      },
    },
    items: [
      {
        id: "item-1",
        productName: "Handloom Chikankari Kurti",
        variantName: "Mulberry Silk / M",
        sku: "KURTI-SILK-M",
        hsnCode: "6204",
        quantity: 1,
        unitPrice: 2499,
        total: 2499,
      },
    ],
    subtotal: 2499,
    taxTotal: 381.2,
    discountTotal: 0,
    shippingCharge: 0,
    grandTotal: 2499,
  };

  const html = generateInvoiceHTML(sampleInvoice);
  assert.ok(html.includes("TAX INVOICE"), "Invoice HTML should contain TAX INVOICE header");
  assert.ok(html.includes("INV-2026-000001"), "Invoice HTML should contain invoice number");
  assert.ok(html.includes("Handloom Chikankari Kurti"), "Invoice HTML should contain product name");
  assert.ok(html.includes("Amit Sharma"), "Invoice HTML should contain buyer name");
  console.log("✓ Tax Invoice Template tests passed.");
}

function testPackingSlipTemplate() {
  console.log("--> Testing Packing Slip HTML Generator...");
  const sampleSlip: PackingSlipData = {
    orderNumber: "NDL-10932",
    orderDate: "30/07/2026",
    shippingMethod: "STANDARD",
    seller: {
      storeName: "Handloom Craft House",
      address: {
        recipientName: "Handloom Store",
        addressLine1: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
      },
    },
    buyer: {
      name: "Amit Sharma",
      phone: "+919876543211",
      shippingAddress: {
        recipientName: "Amit Sharma",
        addressLine1: "Flat 402, Lotus Residency",
        city: "Pune",
        state: "Maharashtra",
        postalCode: "411014",
      },
    },
    items: [
      {
        id: "item-1",
        productName: "Handloom Chikankari Kurti",
        variantName: "Mulberry Silk / M",
        sku: "KURTI-SILK-M",
        quantity: 1,
        unitPrice: 2499,
        total: 2499,
        weightKg: 0.35,
      },
    ],
    totalQuantity: 1,
    totalWeightKg: 0.35,
    packingNotes: "Gift wrapping requested.",
  };

  const html = generatePackingSlipHTML(sampleSlip);
  assert.ok(html.includes("PACKING SLIP"), "Packing slip HTML should contain title");
  assert.ok(html.includes("NDL-10932"), "Packing slip HTML should contain order number");
  assert.ok(html.includes("Gift wrapping requested."), "Packing slip HTML should contain packing notes");
  console.log("✓ Packing Slip Template tests passed.");
}

function testShippingLabelTemplate() {
  console.log("--> Testing Shipping Label HTML Generator...");
  const sampleLabel: ShippingLabelData = {
    orderNumber: "NDL-10932",
    trackingNumber: "AWB-NDL10932",
    courierName: "EXPRESS LOGISTICS",
    isCod: true,
    codAmount: 2499,
    weightKg: 0.45,
    seller: {
      storeName: "Handloom Craft House",
      address: {
        recipientName: "Handloom Store",
        addressLine1: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
      },
    },
    buyer: {
      name: "Amit Sharma",
      phone: "+919876543211",
      shippingAddress: {
        recipientName: "Amit Sharma",
        addressLine1: "Flat 402, Lotus Residency",
        city: "Pune",
        state: "Maharashtra",
        postalCode: "411014",
      },
    },
    itemSummary: "1x Handloom Chikankari Kurti",
    date: "30/07/2026",
  };

  const html = generateShippingLabelHTML(sampleLabel);
  assert.ok(html.includes("EXPRESS LOGISTICS"), "Shipping label HTML should contain courier name");
  assert.ok(html.includes("COD:"), "Shipping label HTML should render COD badge");
  assert.ok(html.includes("AWB-NDL10932"), "Shipping label HTML should contain tracking AWB");
  console.log("✓ Shipping Label Template tests passed.");
}

function testManifestTemplate() {
  console.log("--> Testing Shipment Manifest HTML Generator...");
  const sampleManifest: ManifestData = {
    manifestNumber: "MNF-2026-000001",
    pickupDate: "31/07/2026",
    courierName: "BlueDart Logistics",
    seller: {
      storeName: "Handloom Craft House",
      phone: "+91 9876543210",
      address: {
        recipientName: "Handloom Store",
        addressLine1: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
      },
    },
    totalOrders: 1,
    totalWeightKg: 0.45,
    totalCodAmount: 2499,
    orders: [
      {
        orderNumber: "NDL-10932",
        buyerName: "Amit Sharma",
        buyerPhone: "+919876543211",
        cityState: "Pune, Maharashtra",
        itemsCount: 1,
        weightKg: 0.45,
        isCod: true,
        codAmount: 2499,
        trackingNumber: "AWB-NDL10932",
      },
    ],
  };

  const html = generateManifestHTML(sampleManifest);
  assert.ok(html.includes("COURIER SHIPMENT MANIFEST"), "Manifest HTML should contain title");
  assert.ok(html.includes("MNF-2026-000001"), "Manifest HTML should contain manifest number");
  assert.ok(html.includes("BlueDart Logistics"), "Manifest HTML should contain courier name");
  assert.ok(html.includes("NDL-10932"), "Manifest HTML should list order number");
  console.log("✓ Shipment Manifest Template tests passed.");
}

function runAllTests() {
  console.log("=== PHASE 7 ORDER DOCUMENTS TEST SUITE ===");
  testBarcodeAndQrGenerators();
  testInvoiceTemplate();
  testPackingSlipTemplate();
  testShippingLabelTemplate();
  testManifestTemplate();
  console.log("=== ALL UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
