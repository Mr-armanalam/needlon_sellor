"use client";
import { useRef, useState } from "react";
import HeadingPrice from "../ui/heading-price";
import PricingDetails from "../ui/pricing-details";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import PriceListDownload from "../ui/price-list-download";

const PricingView = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePdf = async () => {
  setIsGenerating(true);
  const element = invoiceRef.current;
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  // strict margins
  const marginTop = 15; 
  const marginBottom = 15;
  const marginLeft = 10;
  const marginRight = 10;

  // the printable area
  const printableWidth = pdfWidth - marginLeft - marginRight;
  const printableHeight = pdfHeight - marginTop - marginBottom;

  const imgProps = pdf.getImageProperties(imgData);
  const imageScaledHeight = (imgProps.height * printableWidth) / imgProps.width;

  let heightLeft = imageScaledHeight;
  let yOffset = 0; // Tracks our progress through the image
  let firstPage = true;

  while (heightLeft > 0) {
    if (!firstPage) pdf.addPage();
    
    // addImage(data, format, x, y, width, height)
    // We use a negative yOffset to "slide" the screenshot up
    pdf.addImage(
      imgData, 
      "PNG", 
      marginLeft, 
      marginTop - yOffset, 
      printableWidth, 
      imageScaledHeight
    );

    heightLeft -= printableHeight;
    yOffset += printableHeight;
    firstPage = false;

    // a white rectangle to "mask" any bleed into the bottom margin
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, pdfHeight - marginBottom, pdfWidth, marginBottom, 'F');
    // mask the top margin just in case
    pdf.rect(0, 0, pdfWidth, marginTop, 'F');
  }

  pdf.save("invoice.pdf");
  setIsGenerating(false);
};

  return (
    <div ref={invoiceRef} className="bg-[#F5F3EF] dark:bg-transparent">
      <PriceListDownload isGenerating={isGenerating} handleDownload={handleGeneratePdf} />
      <HeadingPrice />
      <PricingDetails />
    </div>
  );
};

export default PricingView;
