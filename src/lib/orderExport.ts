/**
 * สร้าง PNG / PDF จาก DOM สำหรับใบสรุปคำสั่งซื้อ (ฝั่ง client เท่านั้น)
 */

export async function elementToPngDataUrl(
  el: HTMLElement,
  scale = 2
): Promise<string> {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(el, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
  });
  return canvas.toDataURL("image/png", 1);
}

export function triggerDownloadDataUrl(
  dataUrl: string,
  filename: string,
  mimeHint: string
): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.setAttribute("type", mimeHint);
  a.click();
}

export async function downloadElementAsPng(
  el: HTMLElement,
  filename: string
): Promise<void> {
  const dataUrl = await elementToPngDataUrl(el);
  triggerDownloadDataUrl(dataUrl, filename.endsWith(".png") ? filename : `${filename}.png`, "image/png");
}

/**
 * แบ่งหน้า A4 อัตโนมัติเมือเนื้อหาสูงกว่าหนึ่งหน้า
 */
export async function downloadElementAsPdf(
  el: HTMLElement,
  filename: string
): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png", 1);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const name = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  pdf.save(name);
}
