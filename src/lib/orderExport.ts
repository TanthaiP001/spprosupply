/**
 * สร้าง PNG / PDF จาก DOM สำหรับใบสรุปคำสั่งซื้อ (ฝั่ง client เท่านั้น)
 */

export const ORDER_EXPORT_LOG_PREFIX = "[orderExport]";

const MAX_CANVAS_EDGE = 8192;
const MAX_PDF_IMAGE_EDGE = 3000; // ลดขนาดก่อนใส่ jsPDF ลด error / memory
const MAX_SCALE = 2;

type ExportKind = "pdf" | "png";

type ExportLogContext = {
  runId: string;
  kind: ExportKind;
  filename: string;
};

function newRunId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function logInfo(ctx: ExportLogContext, phase: string, data?: Record<string, unknown>) {
  const line = { phase, ...data };
  console.info(ORDER_EXPORT_LOG_PREFIX, ctx.kind, ctx.runId.slice(0, 8), ctx.filename, line);
}

function logExportError(
  ctx: Pick<ExportLogContext, "runId" | "kind" | "filename">,
  phase: string,
  e: unknown
) {
  const message = getExportErrorMessage(e);
  if (e instanceof Error) {
    console.error(ORDER_EXPORT_LOG_PREFIX, "FAIL", ctx.kind, ctx.runId, ctx.filename, phase, {
      message: e.message,
      name: e.name,
      stack: e.stack,
      cause: e.cause,
    });
  } else {
    console.error(ORDER_EXPORT_LOG_PREFIX, "FAIL", ctx.kind, ctx.runId, ctx.filename, phase, {
      message,
      value: e,
    });
  }
}

function nowMs() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function safeExportScale(el: HTMLElement, desiredScale: number): number {
  const w = Math.max(1, el.offsetWidth, el.scrollWidth);
  const h = Math.max(1, el.offsetHeight, el.scrollHeight);
  const byW = MAX_CANVAS_EDGE / w;
  const byH = MAX_CANVAS_EDGE / h;
  return Math.max(0.75, Math.min(desiredScale, byW, byH, MAX_SCALE));
}

/** ลดขนาด canvas ก่อนแปลง JPEG ใส่ PDF */
function downscaleCanvasForPdf(
  source: HTMLCanvasElement,
  maxEdge = MAX_PDF_IMAGE_EDGE
): HTMLCanvasElement {
  let { width, height } = source;
  if (width <= 0 || height <= 0) return source;
  if (width <= maxEdge && height <= maxEdge) return source;

  const s = maxEdge / Math.max(width, height);
  const w = Math.max(1, Math.floor(width * s));
  const h = Math.max(1, Math.floor(height * s));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return source;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w, h);
  return c;
}

/** อ่านข้อความ error สำหรับแสดงผู้ใช้ (ไม่ถูก minify) */
export function getExportErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (e != null && typeof e === "object" && "message" in e) {
    const m = (e as { message?: unknown }).message;
    if (typeof m === "string" && m.length) return m;
  }
  return "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
}

export async function elementToPngDataUrl(
  el: HTMLElement,
  scale = 2
): Promise<string> {
  const runId = newRunId();
  const ctx: ExportLogContext = { runId, kind: "png", filename: "inline" };
  logInfo(ctx, "start", { where: "elementToPngDataUrl" });
  try {
    const canvas = await renderElementToCanvas(el, scale, ctx);
    return canvasToPngDataUrl(canvas, ctx);
  } catch (e) {
    logExportError(ctx, "elementToPngDataUrl", e);
    throw e;
  }
}

function canvasToPngDataUrl(canvas: HTMLCanvasElement, logCtx: ExportLogContext): string {
  try {
    const dataUrl = canvas.toDataURL("image/png", 1);
    logInfo(logCtx, "png_toDataUrl", { dataUrlLength: dataUrl.length });
    return dataUrl;
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    throw new Error(
      `ไม่สามารถอ่านภาพจาก canvas: ${err.message}`,
      { cause: e }
    );
  }
}

export async function renderElementToCanvas(
  el: HTMLElement,
  scale = 2,
  logCtx?: ExportLogContext
): Promise<HTMLCanvasElement> {
  const t0 = nowMs();
  if (logCtx) {
    logInfo(logCtx, "render:begin", {
      elTag: el.tagName,
      offsetW: el.offsetWidth,
      offsetH: el.offsetHeight,
      scrollW: el.scrollWidth,
      scrollH: el.scrollHeight,
      requestedScale: scale,
    });
  }

  if (typeof document !== "undefined" && document.fonts) {
    const tf = nowMs();
    try {
      await document.fonts.ready;
      if (logCtx) {
        logInfo(logCtx, "render:fonts_ready", { ms: Math.round(nowMs() - tf) });
      }
    } catch (fe) {
      if (logCtx) {
        logInfo(logCtx, "render:fonts_ready_skipped", { err: getExportErrorMessage(fe) });
      }
    }
  }

  const timp = nowMs();
  const html2canvas = (await import("html2canvas")).default;
  if (logCtx) {
    logInfo(logCtx, "render:import_html2canvas", { ms: Math.round(nowMs() - timp) });
  }

  const useScale = safeExportScale(el, scale);
  if (logCtx) {
    logInfo(logCtx, "render:scale", { useScale });
  }

  const traf = nowMs();
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
  if (logCtx) {
    logInfo(logCtx, "render:raf", { ms: Math.round(nowMs() - traf) });
  }

  const th2c = nowMs();
  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(el, {
      scale: useScale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: 0,
      onclone: (_doc, cloned) => {
        if (cloned instanceof HTMLElement) {
          cloned.style.maxHeight = "none";
          cloned.style.overflow = "visible";
        }
      },
    });
  } catch (e) {
    if (logCtx) {
      logExportError(logCtx, "render:html2canvas", e);
    }
    throw e;
  }
  if (logCtx) {
    logInfo(logCtx, "render:html2canvas_ok", {
      ms: Math.round(nowMs() - th2c),
      totalMs: Math.round(nowMs() - t0),
      canvasW: canvas.width,
      canvasH: canvas.height,
    });
  }
  return canvas;
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
  const runId = newRunId();
  const logCtx: ExportLogContext = { runId, kind: "png", filename };
  const t0 = nowMs();
  logInfo(logCtx, "export:start", {
    ua: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 80) : "",
    viewport:
      typeof window !== "undefined"
        ? { w: window.innerWidth, h: window.innerHeight }
        : null,
  });
  try {
    const canvas = await renderElementToCanvas(el, 2, logCtx);
    if (canvas.width < 1 || canvas.height < 1) {
      const err = new Error("canvas_size_zero");
      logExportError(logCtx, "post_render_check", err);
      throw new Error("ไม่สามารถสร้างภาพได้ (ขนาดเป็น 0)");
    }
    const dataUrl = canvasToPngDataUrl(canvas, logCtx);
    triggerDownloadDataUrl(
      dataUrl,
      filename.endsWith(".png") ? filename : `${filename}.png`,
      "image/png"
    );
    logInfo(logCtx, "export:done", { totalMs: Math.round(nowMs() - t0) });
  } catch (e) {
    logExportError(logCtx, "export:fail", e);
    throw e;
  }
}

/**
 * แบ่งหน้า A4 อัตโนมัติ
 * ใช้สตริง JPEG กับ addImage แทน HTMLCanvasElement — รองรับ build มินิฟาย/เบราว์เซอร์ได้ดีกว่า
 */
export async function downloadElementAsPdf(
  el: HTMLElement,
  filename: string
): Promise<void> {
  const runId = newRunId();
  const logCtx: ExportLogContext = { runId, kind: "pdf", filename };
  const t0 = nowMs();
  logInfo(logCtx, "export:start", {
    ua: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 80) : "",
    viewport:
      typeof window !== "undefined"
        ? { w: window.innerWidth, h: window.innerHeight }
        : null,
  });
  try {
    const tRender = nowMs();
    const rawCanvas = await renderElementToCanvas(el, 2, logCtx);
    logInfo(logCtx, "pdf:after_render", { renderMs: Math.round(nowMs() - tRender) });

    if (rawCanvas.width < 1 || rawCanvas.height < 1) {
      const err = new Error("raw_canvas_size_zero");
      logExportError(logCtx, "post_render_check", err);
      throw new Error("ไม่สามารถสร้างภาพได้ (ขนาดเป็น 0)");
    }

    const tDown = nowMs();
    const canvas = downscaleCanvasForPdf(rawCanvas);
    logInfo(logCtx, "pdf:downscale", {
      from: { w: rawCanvas.width, h: rawCanvas.height },
      to: { w: canvas.width, h: canvas.height },
      ms: Math.round(nowMs() - tDown),
    });
    const imageFormat = "JPEG" as const;
    let dataUrl: string;
    const tJpeg = nowMs();
    try {
      dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      logInfo(logCtx, "pdf:jpeg_dataUrl", {
        ms: Math.round(nowMs() - tJpeg),
        dataUrlLength: dataUrl.length,
      });
    } catch (e) {
      logExportError(logCtx, "pdf:jpeg_dataUrl", e);
      const err = e instanceof Error ? e : new Error(String(e));
      throw new Error(
        `แปลงภาพเป็น JPEG สำหรับ PDF ไม่ได้: ${err.message} (ลองดาวน์โหลดรูปแทน)`,
        { cause: e }
      );
    }

    const tJs = nowMs();
    const { jsPDF } = await import("jspdf");
    logInfo(logCtx, "pdf:import_jspdf", { ms: Math.round(nowMs() - tJs) });

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let ip: { width: number; height: number };
    let usedFallback = false;
    const tGip = nowMs();
    try {
      ip = pdf.getImageProperties(dataUrl);
    } catch (ge) {
      usedFallback = true;
      console.warn(ORDER_EXPORT_LOG_PREFIX, "pdf:getImageProperties_fallback", logCtx.kind, logCtx.runId, {
        err: getExportErrorMessage(ge),
        useCanvas: { w: canvas.width, h: canvas.height },
      });
      ip = { width: canvas.width, height: canvas.height };
    }
    logInfo(logCtx, "pdf:imageProps", {
      ms: Math.round(nowMs() - tGip),
      ipW: ip.width,
      ipH: ip.height,
      usedFallback,
    });
    const imgWidth = pageWidth;
    const imgHeight = (ip.height * pageWidth) / ip.width;
    if (!Number.isFinite(imgHeight) || imgHeight <= 0) {
      const err = new Error("imgHeight_invalid");
      logExportError(logCtx, "pdf:calc_height", err);
      throw new Error("คำนวณความสูงรูปใน PDF ไม่ได้");
    }
    const pageCount = Math.max(1, Math.ceil(imgHeight / pageHeight));
    logInfo(logCtx, "pdf:layout", {
      pageWmm: pageWidth,
      pageHmm: pageHeight,
      imgHmm: imgHeight,
      estimatedPages: pageCount,
    });

    const tAdd = nowMs();
    let heightLeft = imgHeight;
    let position = 0;
    let addIterations = 0;
    pdf.addImage(dataUrl, imageFormat, 0, position, imgWidth, imgHeight);
    addIterations += 1;
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, imageFormat, 0, position, imgWidth, imgHeight);
      addIterations += 1;
      heightLeft -= pageHeight;
    }
    logInfo(logCtx, "pdf:addImage_done", { ms: Math.round(nowMs() - tAdd), addIterations });

    const name = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    const tSave = nowMs();
    pdf.save(name);
    logInfo(logCtx, "pdf:save", { ms: Math.round(nowMs() - tSave), name });
    logInfo(logCtx, "export:done", { totalMs: Math.round(nowMs() - t0) });
  } catch (e) {
    logExportError(logCtx, "export:fail", e);
    throw e;
  }
}
