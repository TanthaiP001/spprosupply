/**
 * สร้าง PNG / PDF จาก DOM สำหรับใบสรุปคำสั่งซื้อ (ฝั่ง client เท่านั้น)
 */

const MAX_CANVAS_EDGE = 8192;
const MAX_SCALE = 2;

function safeExportScale(el: HTMLElement, desiredScale: number): number {
  const w = Math.max(1, el.offsetWidth, el.scrollWidth);
  const h = Math.max(1, el.offsetHeight, el.scrollHeight);
  const byW = MAX_CANVAS_EDGE / w;
  const byH = MAX_CANVAS_EDGE / h;
  return Math.max(0.75, Math.min(desiredScale, byW, byH, MAX_SCALE));
}

/**
 * จับกรอบนอก parent ที่มี transform/overflow ที่ทำให้ html2canvas ล้มเหลว
 */
function wrapCloneForCapture(source: HTMLElement): { target: HTMLElement; cleanup: () => void } {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-order-export-clone", "true");
  wrapper.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "z-index:2147483646",
    "box-sizing:border-box",
    "width:min(100vw,800px)",
    "max-width:100%",
    "background:#ffffff",
    "padding:0",
    "margin:0",
    "pointer-events:none",
  ].join(";");

  const clone = source.cloneNode(true) as HTMLElement;
  clone.setAttribute("data-order-export", "true");
  const w = Math.min(800, source.offsetWidth || source.scrollWidth || 800);
  clone.style.width = `${w}px`;
  clone.style.maxWidth = "100%";
  clone.style.boxSizing = "border-box";

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return {
    target: clone,
    cleanup: () => {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    },
  };
}

export async function elementToPngDataUrl(
  el: HTMLElement,
  scale = 2
): Promise<string> {
  const canvas = await renderElementToCanvas(el, scale);
  return canvasToPngDataUrl(canvas);
}

function canvasToPngDataUrl(canvas: HTMLCanvasElement): string {
  try {
    return canvas.toDataURL("image/png", 1);
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    throw new Error(
      `ไม่สามารถอ่นภาพจาก canvas: ${err.message} (อาจมีรูหรือฟอนต์ข้ามแหล่ง)`,
      { cause: e }
    );
  }
}

export async function renderElementToCanvas(
  el: HTMLElement,
  scale = 2
): Promise<HTMLCanvasElement> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }

  const html2canvas = (await import("html2canvas")).default;
  const { target, cleanup } = wrapCloneForCapture(el);
  const useScale = safeExportScale(el, scale);

  try {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    return await html2canvas(target, {
      scale: useScale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: 0,
    });
  } finally {
    cleanup();
  }
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
  const canvas = await renderElementToCanvas(el);
  const dataUrl = canvasToPngDataUrl(canvas);
  triggerDownloadDataUrl(
    dataUrl,
    filename.endsWith(".png") ? filename : `${filename}.png`,
    "image/png"
  );
}

/**
 * แบ่งหน้า A4 อัตโนมัติเมือเนื้อหาสูงกว่าหนึ่งหน้า
 * ส่ง canvas เข้า jsPDF โดยตรง แทน data URL ยาว ๆ ลดโอกาส error จาก string / memory
 */
export async function downloadElementAsPdf(
  el: HTMLElement,
  filename: string
): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const canvas = await renderElementToCanvas(el);
  if (canvas.width < 1 || canvas.height < 1) {
    throw new Error("ไม่สามารถสร้างภาพได้ (ขนาดเป็น 0)");
  }

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  if (!Number.isFinite(imgHeight) || imgHeight <= 0) {
    throw new Error("คำนวณความสูง PDF ไม่ได้");
  }

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const name = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  pdf.save(name);
}
