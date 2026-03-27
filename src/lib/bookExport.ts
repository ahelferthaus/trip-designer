import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Render a DOM element to PDF.
 * Call with the container that holds all rendered book pages.
 */
export async function exportBookToPDF(
  pagesContainer: HTMLElement,
  title: string,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const pages = pagesContainer.querySelectorAll("[data-book-page]");
  if (pages.length === 0) throw new Error("No pages to export");

  // 8.5 x 11 inch at 150 DPI = 1275 x 1650 px
  const pageWidth = 8.5;
  const pageHeight = 11;
  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: [pageWidth, pageHeight] });

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();
    onProgress?.(i + 1, pages.length);

    const canvas = await html2canvas(pages[i] as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height / canvas.width) * pageWidth;

    // Center vertically if image is shorter than page
    const yOffset = imgHeight < pageHeight ? (pageHeight - imgHeight) / 2 : 0;
    pdf.addImage(imgData, "JPEG", 0, yOffset, imgWidth, Math.min(imgHeight, pageHeight));
  }

  pdf.setProperties({ title, creator: "VYBR", subject: "Travel Photo Book" });
  return pdf.output("blob");
}

/**
 * Download a blob as a file.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
